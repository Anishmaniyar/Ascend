// Authorization subsystem tests (node:test, no framework).
// DB-backed against the dev database. Every fixture uses unique markers and
// is removed in teardown — real user rows are never touched.
//
// Run: npm test
import "dotenv/config";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/db.js";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  isKnownPermission,
} from "../src/modules/authorization/authorization.constants.js";
import { hasPermission } from "../src/modules/authorization/authorization.service.js";
import { requirePermission } from "../src/middleware/requirePermission.middleware.js";
import { requirePracticeSessionOwnership } from "../src/middleware/practiceOwnership.middleware.js";
import * as practiceService from "../src/modules/practiceSession/practice-session.service.js";

const TAG = `authtest-${Date.now()}`;
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
let sessionId;

const runMiddleware = (middleware, req) =>
  new Promise((resolve) => {
    const res = {};
    const next = (err) => resolve(err);
    Promise.resolve(middleware(req, res, next)).catch(next);
  });

before(async () => {
  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  assert.ok(userRole, "USER role must be seeded (npm run db:seed)");
  userRoleId = userRole.id;

  userA = await prisma.user.create({
    data: { name: "AuthTest A", email: emailA, roleId: userRoleId },
  });
  userB = await prisma.user.create({
    data: { name: "AuthTest B", email: emailB, roleId: userRoleId },
  });

  const topic = await prisma.topic.create({
    data: { title: `${TAG} topic`, description: "authz fixture" },
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

  const mkQuestion = async (subtopicId, label) => {
    const q = await prisma.question.create({
      data: {
        title: `${TAG} ${label}`,
        solution: "s",
        subtopicId,
        options: { create: [{ text: "opt", isCorrect: true }] },
      },
      include: { options: true },
    });
    return q;
  };
  const qA = await mkQuestion(subtopicAId, "qA");
  const qB = await mkQuestion(subtopicBId, "qB");
  questionAId = qA.id;
  questionBId = qB.id;
  optionAId = qA.options[0].id;
  optionBId = qB.options[0].id;

  const session = await practiceService.createPracticeSessionService(
    userA.id,
    subtopicAId,
    "PRACTICE",
  );
  sessionId = session.id;
});

after(async () => {
  // Cascades: users -> sessions/attempts/accounts; topics -> full content tree.
  await prisma.user.deleteMany({ where: { email: { in: [emailA, emailB] } } });
  await prisma.topic.deleteMany({ where: { title: { startsWith: TAG } } });
  await prisma.$disconnect();
});

describe("permission catalog", () => {
  it("every role assignment references a known permission", () => {
    for (const names of Object.values(ROLE_PERMISSIONS)) {
      for (const name of names) {
        assert.ok(isKnownPermission(name), `unknown permission: ${name}`);
      }
    }
  });

  it("ADMIN holds every USER permission plus writes", () => {
    for (const name of ROLE_PERMISSIONS.USER) {
      assert.ok(ROLE_PERMISSIONS.ADMIN.includes(name));
    }
    assert.ok(ROLE_PERMISSIONS.ADMIN.includes("questions:create"));
  });
});

describe("hasPermission", () => {
  it("USER is allowed topics:read", async () => {
    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
    assert.equal(await hasPermission(userRole.id, "topics:read"), true);
  });

  it("USER is denied questions:create", async () => {
    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
    assert.equal(await hasPermission(userRole.id, "questions:create"), false);
  });

  it("ADMIN is allowed questions:create", async () => {
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    assert.equal(await hasPermission(adminRole.id, "questions:create"), true);
  });

  it("missing roleId is denied, not an error", async () => {
    assert.equal(await hasPermission(null, "topics:read"), false);
  });

  it("unknown permission fails closed with 500", async () => {
    await assert.rejects(hasPermission(userRoleId, "nope:missing"), (err) => {
      assert.equal(err.statusCode, 500);
      return true;
    });
  });
});

describe("requirePermission middleware", () => {
  it("lets USER through topics:read", async () => {
    const err = await runMiddleware(requirePermission("topics:read"), {
      user: { id: userA.id, roleId: userRoleId, role: "USER" },
      method: "GET",
      originalUrl: "/api/v1/topic/",
    });
    assert.equal(err, undefined);
  });

  it("blocks USER from questions:create with 403", async () => {
    const err = await runMiddleware(requirePermission("questions:create"), {
      user: { id: userA.id, roleId: userRoleId, role: "USER" },
      method: "POST",
      originalUrl: "/api/v1/admin/questions",
    });
    assert.equal(err?.statusCode, 403);
  });

  it("rejects unauthenticated requests with 401", async () => {
    const err = await runMiddleware(requirePermission("topics:read"), {
      method: "GET",
      originalUrl: "/api/v1/topic/",
    });
    assert.equal(err?.statusCode, 401);
  });
});

describe("practice ownership middleware", () => {
  it("allows the session owner", async () => {
    const req = { user: { id: userA.id }, params: { id: sessionId } };
    const err = await runMiddleware(requirePracticeSessionOwnership, req);
    assert.equal(err, undefined);
    assert.equal(req.practiceSession?.id, sessionId);
  });

  it("403s a different user", async () => {
    const err = await runMiddleware(requirePracticeSessionOwnership, {
      user: { id: userB.id },
      params: { id: sessionId },
    });
    assert.equal(err?.statusCode, 403);
  });

  it("404s a missing session", async () => {
    const err = await runMiddleware(requirePracticeSessionOwnership, {
      user: { id: userA.id },
      params: { id: "00000000-0000-0000-0000-000000000000" },
    });
    assert.equal(err?.statusCode, 404);
  });
});

describe("attempt integrity rules", () => {
  it("rejects a question from another subtopic (400)", async () => {
    await assert.rejects(
      practiceService.submitAttemptService(
        sessionId,
        questionBId,
        optionBId,
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /subtopic/);
        return true;
      },
    );
  });

  it("rejects an option belonging to another question (400)", async () => {
    await assert.rejects(
      practiceService.submitAttemptService(
        sessionId,
        questionAId,
        optionBId,
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 400);
        return true;
      },
    );
  });

  it("rejects another user's session (403)", async () => {
    await assert.rejects(
      practiceService.submitAttemptService(
        sessionId,
        questionAId,
        optionAId,
        userB.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 403);
        return true;
      },
    );
  });

  it("accepts a same-subtopic attempt, then rejects the duplicate (409)", async () => {
    const attempt = await practiceService.submitAttemptService(
      sessionId,
      questionAId,
      optionAId,
      userA.id,
    );
    assert.equal(attempt.isCorrect, true);

    await assert.rejects(
      practiceService.submitAttemptService(
        sessionId,
        questionAId,
        optionAId,
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  });

  it("rejects attempts on a completed session (400)", async () => {
    await practiceService.completePracticeSessionService(userA.id, sessionId);
    await assert.rejects(
      practiceService.submitAttemptService(
        sessionId,
        questionAId,
        optionAId,
        userA.id,
      ),
      (err) => {
        assert.equal(err.statusCode, 400);
        return true;
      },
    );
  });
});

assert.ok(Object.keys(PERMISSIONS).length === 23, "catalog has 23 permissions");
