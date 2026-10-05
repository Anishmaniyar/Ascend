// Content + community backend tests (node:test, no framework).
// Covers sheets reads, sheet-bound practice, results review, progress,
// leaderboard, discussions and contests. DB-backed, unique fixtures,
// self-cleaning.
//
// Run: npm test
import "dotenv/config";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/db.js";
import { hasPermission } from "../src/modules/authorization/authorization.service.js";
import * as TopicService from "../src/modules/topics/topic.service.js";
import * as practiceService from "../src/modules/practiceSession/practice-session.service.js";
import * as ProfileService from "../src/modules/profile/profile.service.js";
import * as LeaderboardService from "../src/modules/leaderboard/leaderboard.service.js";
import * as DiscussionService from "../src/modules/discussions/discussion.service.js";
import * as ContestService from "../src/modules/contests/contest.service.js";

const TAG = `contenttest-${Date.now()}`;
const emailA = `${TAG}-a@example.com`;
const emailB = `${TAG}-b@example.com`;

let userRoleId;
let userA;
let userB;
let topicId;
let subtopicAId;
let subtopicBId;
let questionAId;
let questionBId;
let optionAId;
let optionBId;
let sheetId;
let contestId;

const mkQuestion = async (subtopicId, label) => {
  const q = await prisma.question.create({
    data: {
      title: `${TAG} ${label}`,
      solution: "sol",
      subtopicId,
      options: {
        create: [
          { text: "right", isCorrect: true },
          { text: "wrong", isCorrect: false },
        ],
      },
    },
    include: { options: true },
  });
  return q;
};

before(async () => {
  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  assert.ok(userRole, "USER role must be seeded (npm run db:seed)");
  userRoleId = userRole.id;

  userA = await prisma.user.create({
    data: { name: "ContentTest A", email: emailA, roleId: userRoleId },
  });
  userB = await prisma.user.create({
    data: { name: "ContentTest B", email: emailB, roleId: userRoleId },
  });

  const topic = await prisma.topic.create({
    data: { title: `${TAG} topic`, description: "content fixture" },
  });
  topicId = topic.id;
  const subA = await prisma.subtopic.create({
    data: { title: `${TAG} A`, description: "a", topicId },
  });
  const subB = await prisma.subtopic.create({
    data: { title: `${TAG} B`, description: "b", topicId },
  });
  subtopicAId = subA.id;
  subtopicBId = subB.id;

  const qA = await mkQuestion(subtopicAId, "qA");
  const qB = await mkQuestion(subtopicBId, "qB");
  questionAId = qA.id;
  questionBId = qB.id;
  optionAId = qA.options.find((o) => o.isCorrect).id;
  optionBId = qB.options.find((o) => o.isCorrect).id;

  const sheet = await prisma.sheet.create({
    data: {
      title: `${TAG} sheet`,
      description: "d",
      companyName: `${TAG} Co`,
      sheetQuestions: { create: [{ questionId: questionAId }] },
    },
  });
  sheetId = sheet.id;

  const contest = await ContestService.createContestService({
    title: `${TAG} contest`,
    description: "d",
    type: "WEEKLY",
    startsAt: new Date(Date.now() + 86_400_000),
    endsAt: new Date(Date.now() + 2 * 86_400_000),
    durationMin: 60,
    totalQuestions: 10,
  });
  contestId = contest.id;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [emailA, emailB] } } });
  await prisma.topic.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.sheet.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.contest.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.discussion.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.$disconnect();
});

describe("topics + sheets reads", () => {
  it("topics include subtopic shells with question counts", async () => {
    const topics = await TopicService.getAllTopics();
    const mine = topics.find((t) => t.id === topicId);
    assert.ok(mine);
    assert.equal(mine.subtopics.length, 2);
    assert.ok(mine.subtopics.every((s) => s._count.questions === 1));
  });

  it("sheets list carries per-user solved counts", async () => {
    const sheets = await TopicService.getAllSheets(userA.id);
    const mine = sheets.find((s) => s.id === sheetId);
    assert.ok(mine);
    assert.equal(mine.questionCount, 1);
    assert.equal(mine.solved, 0);
  });

  it("sheet questions 404s unknown ids and returns options", async () => {
    await assert.rejects(
      TopicService.getSheetQuestions(
        "00000000-0000-0000-0000-000000000000",
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 404);
        return true;
      },
    );
    const sheet = await TopicService.getSheetQuestions(sheetId, userA.id);
    assert.equal(sheet.questions.length, 1);
    assert.equal(sheet.questions[0].options.length, 2);
    assert.deepEqual(sheet.progress, { solved: 0, total: 1, percent: 0 });
  });
});

describe("sheet-bound practice sessions", () => {
  it("creates a sheet session and enforces sheet membership", async () => {
    const session = await practiceService.createPracticeSessionService(
      userA.id,
      null,
      "PRACTICE",
      sheetId,
    );
    assert.equal(session.sheetId, sheetId);

    // Mapped question: accepted.
    const attempt = await practiceService.submitAttemptService(
      session.id,
      questionAId,
      optionAId,
      userA.id,
    );
    assert.equal(attempt.isCorrect, true);

    // Question from another subtopic, not in the sheet: rejected.
    await assert.rejects(
      practiceService.submitAttemptService(
        session.id,
        questionBId,
        optionBId,
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /sheet/);
        return true;
      },
    );

    await practiceService.completePracticeSessionService(userA.id, session.id);
  });

  it("results include the per-question review with answers", async () => {
    const session = await practiceService.createPracticeSessionService(
      userB.id,
      subtopicAId,
      "PRACTICE",
    );
    await practiceService.submitAttemptService(
      session.id,
      questionAId,
      optionAId,
      userB.id,
    );
    await practiceService.completePracticeSessionService(userB.id, session.id);

    const results = await practiceService.calculatePracticeResults(
      userB.id,
      session.id,
    );
    assert.equal(results.score, 1);
    assert.equal(results.review.length, 1);
    const r = results.review[0];
    assert.equal(r.questionId, questionAId);
    assert.equal(r.correctOptionId, optionAId);
    assert.equal(r.selectedOptionId, optionAId);
    assert.equal(r.isCorrect, true);
    assert.equal(r.solution, "sol");
    assert.ok(!("isCorrect" in r.options[0]), "options stay answer-free");
  });
});

describe("progress composite", () => {
  it("returns every section the progress page needs", async () => {
    const p = await ProfileService.getProgressService(userA.id);
    assert.equal(p.radial.questionsSolved.solved, 1);
    assert.ok(p.radial.questionsSolved.total >= 2);
    assert.equal(p.monthlyTrend.length, 6);
    assert.ok(p.difficulty.easy.total >= 1);
    assert.ok(p.topics.some((t) => t.solved >= 1));
    assert.ok(p.subtopics.some((s) => s.solved >= 1));
    assert.ok(p.time.completedSessions >= 1);
    assert.equal(typeof p.time.totalPracticeTimeMs, "number");
  });
});

describe("leaderboard", () => {
  it("ranks active users and resolves the current user", async () => {
    const board = await LeaderboardService.getLeaderboardService(
      userA.id,
      "alltime",
      "score",
    );
    assert.ok(board.entries.length >= 1);
    const me = board.entries.find((e) => e.isCurrentUser);
    assert.ok(me, "userA has attempts, so is ranked");
    assert.equal(me.questionsSolved, 1);
    assert.ok(board.resetInfo.length > 0);
  });

  it("returns null rank for users with no activity", async () => {
    const fresh = await prisma.user.create({
      data: {
        name: `${TAG} quiet`,
        email: `${TAG}-quiet@example.com`,
        roleId: userRoleId,
      },
    });
    try {
      const board = await LeaderboardService.getLeaderboardService(
        fresh.id,
        "alltime",
        "score",
      );
      assert.equal(board.currentUserRank, null);
    } finally {
      await prisma.user.delete({ where: { id: fresh.id } });
    }
  });
});

describe("discussions", () => {
  it("creates and lists with counts", async () => {
    const created = await DiscussionService.createDiscussionService(userA.id, {
      title: `${TAG} how to solve fast?`,
      content: "I keep spending too long on these questions in tests…",
      tag: "Quant",
    });
    assert.equal(created.replies, 0);

    const list = await DiscussionService.listDiscussionsService();
    const mine = list.find((d) => d.id === created.id);
    assert.ok(mine);
    assert.equal(mine.author, "ContentTest A");
    assert.equal(mine.tag, "Quant");
    assert.ok(mine.snippet.length > 0);
  });
});

describe("contests", () => {
  it("lists with status + registration flag", async () => {
    const list = await ContestService.listContestsService(userA.id);
    const mine = list.find((c) => c.id === contestId);
    assert.ok(mine);
    assert.equal(mine.status, "upcoming");
    assert.equal(mine.registered, false);
    assert.equal(mine.participants, 0);
  });

  it("register → 409 on double → unregister", async () => {
    await ContestService.registerService(contestId, userA.id);
    const detail = await ContestService.getContestService(contestId, userA.id);
    assert.equal(detail.registered, true);
    assert.equal(detail.participants, 1);

    await assert.rejects(
      ContestService.registerService(contestId, userA.id),
      (err) => {
        assert.equal(err.statusCode, 409);
        return true;
      },
    );

    await ContestService.unregisterService(contestId, userA.id);
    const after = await ContestService.getContestService(contestId, userA.id);
    assert.equal(after.registered, false);
  });

  it("rejects registration for ended contests", async () => {
    const past = await ContestService.createContestService({
      title: `${TAG} past contest`,
      type: "COMPANY",
      startsAt: new Date(Date.now() - 3 * 86_400_000),
      endsAt: new Date(Date.now() - 2 * 86_400_000),
      durationMin: 30,
      totalQuestions: 5,
    });
    await assert.rejects(
      ContestService.registerService(past.id, userA.id),
      (err) => {
        assert.equal(err.statusCode, 400);
        return true;
      },
    );
  });
});

describe("new RBAC permissions", () => {
  it("USER holds reads + register, not admin writes", async () => {
    const role = await prisma.role.findUnique({ where: { name: "USER" } });
    for (const p of [
      "leaderboard:read",
      "discussions:read",
      "discussions:create",
      "contests:read",
      "contests:register",
    ]) {
      assert.equal(await hasPermission(role.id, p), true, p);
    }
    for (const p of ["contests:create", "contests:update", "contests:delete"]) {
      assert.equal(await hasPermission(role.id, p), false, p);
    }
  });

  it("ADMIN holds contest writes", async () => {
    const role = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    assert.equal(await hasPermission(role.id, "contests:create"), true);
  });
});
