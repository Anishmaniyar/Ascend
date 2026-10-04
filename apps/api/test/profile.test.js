// Profile + badges subsystem tests (node:test, no framework).
// DB-backed against the dev database. Every fixture uses unique markers and
// is removed in teardown — real user rows are never touched.
//
// Run: npm test
import "dotenv/config";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/db.js";
import { hasPermission } from "../src/modules/authorization/authorization.service.js";
import * as ProfileService from "../src/modules/profile/profile.service.js";
import {
  resolveSkillLevel,
  maxConsecutiveDayStreak,
  SKILL_MIN_SOLVED,
} from "../src/modules/profile/profile.service.js";
import { updateProfileValidation } from "../src/modules/profile/profile.validator.js";
import * as practiceService from "../src/modules/practiceSession/practice-session.service.js";
import * as BadgeService from "../src/modules/badges/badge.service.js";
import { BADGE_DEFINITIONS } from "../src/modules/badges/badge.constants.js";

const TAG = `profiletest-${Date.now()}`;
const emailA = `${TAG}-a@example.com`;
const emailB = `${TAG}-b@example.com`;

let userRoleId;
let userA;
let userB;
let subtopicAId;
let questionAId;
let optionAId;
let sessionId;

before(async () => {
  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  assert.ok(userRole, "USER role must be seeded (npm run db:seed)");
  userRoleId = userRole.id;

  // Badge definitions must exist for the evaluation tests (same upsert as seed).
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }

  userA = await prisma.user.create({
    data: { name: "ProfileTest A", email: emailA, roleId: userRoleId },
  });
  userB = await prisma.user.create({
    data: { name: "ProfileTest B", email: emailB, roleId: userRoleId },
  });

  const topic = await prisma.topic.create({
    data: { title: `${TAG} topic`, description: "profile fixture" },
  });
  const subA = await prisma.subtopic.create({
    data: { title: `${TAG} A`, description: "a", topicId: topic.id },
  });
  subtopicAId = subA.id;

  const q = await prisma.question.create({
    data: {
      title: `${TAG} qA`,
      solution: "s",
      subtopicId: subtopicAId,
      options: { create: [{ text: "opt", isCorrect: true }] },
    },
    include: { options: true },
  });
  questionAId = q.id;
  optionAId = q.options[0].id;

  const session = await practiceService.createPracticeSessionService(
    userA.id,
    subtopicAId,
    "PRACTICE",
  );
  sessionId = session.id;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [emailA, emailB] } } });
  await prisma.topic.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.$disconnect();
});

describe("skill level rules (Phase 8, service — not DB, not frontend)", () => {
  it(`samples below ${SKILL_MIN_SOLVED} stay fundamental`, () => {
    assert.equal(resolveSkillLevel(0, 100), "fundamental");
    assert.equal(resolveSkillLevel(9, 100), "fundamental");
  });

  it("10+ samples: <50 fundamental, 50-75 intermediate, >75 advanced", () => {
    assert.equal(resolveSkillLevel(10, 0), "fundamental");
    assert.equal(resolveSkillLevel(10, 49), "fundamental");
    assert.equal(resolveSkillLevel(10, 50), "intermediate");
    assert.equal(resolveSkillLevel(10, 75), "intermediate");
    assert.equal(resolveSkillLevel(10, 76), "advanced");
    assert.equal(resolveSkillLevel(200, 100), "advanced");
  });
});

describe("maxConsecutiveDayStreak", () => {
  it("handles empty, single, consecutive and gapped days", () => {
    assert.equal(maxConsecutiveDayStreak([]), 0);
    assert.equal(maxConsecutiveDayStreak(["2026-10-01"]), 1);
    assert.equal(
      maxConsecutiveDayStreak(["2026-10-01", "2026-10-02", "2026-10-03"]),
      3,
    );
    assert.equal(
      maxConsecutiveDayStreak(["2026-10-01", "2026-10-03", "2026-10-04"]),
      2,
    );
  });
});

describe("getProfile (User + Profile DTO)", () => {
  it("self-heals a missing Profile row and returns the DTO shape", async () => {
    const dto = await ProfileService.getProfileService(userA.id);
    assert.equal(dto.id, userA.id);
    assert.equal(dto.email, emailA);
    assert.equal(dto.displayName, "ProfileTest A");
    assert.ok(dto.handle, "handle is generated on first read");
    assert.equal(dto.initials, "PA");
    assert.deepEqual(dto.targetCompanies, []);
    assert.equal(dto.dailyQuestionGoal, 20);
    assert.ok(dto.memberSince instanceof Date);
    assert.equal(dto.roleId, undefined, "account role never leaks");
  });
});

describe("updateProfile (PATCH /profile)", () => {
  it("updates allowed fields", async () => {
    const dto = await ProfileService.updateProfileService(userA.id, {
      bio: "Backend engineer",
      location: "Pune",
      targetCompanies: ["Google", "Microsoft"],
      dailyQuestionGoal: 25,
    });
    assert.equal(dto.bio, "Backend engineer");
    assert.equal(dto.location, "Pune");
    assert.deepEqual(dto.targetCompanies, ["Google", "Microsoft"]);
    assert.equal(dto.dailyQuestionGoal, 25);
  });

  it("ignores forbidden account fields", async () => {
    const dto = await ProfileService.updateProfileService(userA.id, {
      bio: "still here",
      email: "hacker@example.com",
      roleId: "admin-role-id",
      userId: "someone-else",
    });
    assert.equal(dto.email, emailA, "email unchanged");
    assert.equal(dto.bio, "still here");
    const row = await prisma.user.findUnique({ where: { id: userA.id } });
    assert.equal(row.email, emailA);
  });

  it("409s a handle taken by another user", async () => {
    await ProfileService.updateProfileService(userA.id, {
      handle: `${TAG}-handle`,
    });
    await assert.rejects(
      ProfileService.updateProfileService(userB.id, {
        handle: `${TAG}-HANDLE`,
      }),
      (err) => {
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  });
});

describe("updateProfileValidation", () => {
  it("strips account fields instead of failing", () => {
    const parsed = updateProfileValidation.parse({
      body: { bio: "hi", email: "x@y.z", roleId: "r", userId: "u" },
      params: {},
      query: {},
    });
    assert.equal(parsed.body.bio, "hi");
    assert.equal(parsed.body.email, undefined);
    assert.equal(parsed.body.roleId, undefined);
  });

  it("rejects bad gender, bad URL and out-of-range goal", () => {
    assert.throws(() =>
      updateProfileValidation.parse({
        body: { gender: "Unknown" },
        params: {},
        query: {},
      }),
    );
    assert.throws(() =>
      updateProfileValidation.parse({
        body: { githubUrl: "not-a-url" },
        params: {},
        query: {},
      }),
    );
    assert.throws(() =>
      updateProfileValidation.parse({
        body: { dailyQuestionGoal: 0 },
        params: {},
        query: {},
      }),
    );
  });
});

describe("derived reads", () => {
  it("history returns the frontend shape (topic, durations, counts)", async () => {
    await practiceService.submitAttemptService(
      sessionId,
      questionAId,
      optionAId,
      userA.id,
    );
    await practiceService.completePracticeSessionService(userA.id, sessionId);

    const history = await ProfileService.getPracticeHistoryService(userA.id);
    assert.equal(history.length, 1);
    const h = history[0];
    assert.equal(h.sessionId, sessionId);
    assert.ok(h.topic, "topic title included");
    assert.ok(h.subtopic, "subtopic title included");
    assert.equal(h.mode, "PRACTICE");
    assert.equal(h.questionsAttempted, 1);
    assert.equal(h.correctAnswers, 1);
    assert.equal(h.score, 1);
    assert.equal(h.accuracy, 100);
    assert.ok(
      typeof h.durationMs === "number" && h.durationMs >= 0,
      "duration derived, not stored",
    );
    assert.ok(h.completedAt instanceof Date);
  });

  it("continue is null once the session is completed", async () => {
    const cont = await ProfileService.getContinueSessionService(userA.id);
    assert.equal(cont, null);
  });

  it("heatmap returns days + derived streak stats (no table)", async () => {
    const heat = await ProfileService.getUserHeatmapData(userA.id);
    assert.ok(Array.isArray(heat.days));
    assert.equal(heat.totalActiveDays, heat.days.length);
    assert.equal(typeof heat.maxStreak, "number");
    assert.ok(heat.maxStreak >= 1);
  });

  it("skills carry levels and recommendations sort weakest-first", async () => {
    const skills = await ProfileService.calculateSkills(userA.id);
    assert.equal(skills.length, 1);
    assert.equal(skills[0].solved, 1);
    assert.equal(skills[0].accuracy, 100);
    assert.equal(skills[0].level, "fundamental", "1 sample < minimum");

    const recs = await ProfileService.getRecommendationsService(userA.id);
    assert.equal(recs.length, 1);
    assert.equal(recs[0].reason, "Lowest accuracy");
  });

  it("stats include mode and difficulty breakdowns", async () => {
    const stats = await ProfileService.getProfileStatsService(userA.id);
    assert.equal(stats.questionsSolved, 1);
    assert.equal(stats.accuracy, 100);
    assert.equal(stats.byMode.practice, 1);
    assert.equal(stats.byMode.test, 0);
    assert.ok(stats.byDifficulty.easy.total >= 1);
  });
});

describe("badges (evaluation + listing)", () => {
  it("FIRST_SOLVE is earned via the attempt flow (Phase 16 hook)", async () => {
    const badges = await BadgeService.listBadgesForUser(userA.id);
    const first = badges.find((b) => b.code === "FIRST_SOLVE");
    assert.ok(first, "catalog lists FIRST_SOLVE");
    assert.equal(first.earned, true, "submitAttempt auto-granted it");
    assert.ok(first.earnedAt instanceof Date);
    assert.equal(
      badges.length,
      BADGE_DEFINITIONS.length,
      "frontend sees the full catalog, not just earned rows",
    );
  });

  it("evaluation is idempotent (UNIQUE(userId, badgeId))", async () => {
    const before = await prisma.userBadge.count({
      where: { userId: userA.id },
    });
    const earned = await BadgeService.evaluateAchievements(userA.id);
    assert.deepEqual(earned, []);
    const after = await prisma.userBadge.count({
      where: { userId: userA.id },
    });
    assert.equal(after, before);
  });
});

describe("profile RBAC (Phase 13/18)", () => {
  it("USER holds profile:read and profile:update", async () => {
    const role = await prisma.role.findUnique({ where: { name: "USER" } });
    assert.equal(await hasPermission(role.id, "profile:read"), true);
    assert.equal(await hasPermission(role.id, "profile:update"), true);
  });

  it("ADMIN holds profile:update", async () => {
    const role = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    assert.equal(await hasPermission(role.id, "profile:update"), true);
  });
});
