import prisma from "../../db.js";

export const findBadgeByCode = (code) => {
  return prisma.badge.findUnique({
    where: { code },
  });
};

export const findAllBadges = () => {
  return prisma.badge.findMany({
    orderBy: { createdAt: "asc" },
  });
};

export const findUserBadge = (userId, badgeId) => {
  return prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });
};

export const createUserBadge = (userId, badgeId) => {
  return prisma.userBadge.create({
    data: { userId, badgeId },
  });
};

export const findUserBadgesWithDetails = (userId) => {
  return prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "asc" },
  });
};

// ---- Evaluation reads (raw counts; rules live in badge.service.js) ----

export const countAttempts = (userId) => {
  return prisma.attempt.count({ where: { userId } });
};

export const countUniqueSolved = async (userId) => {
  const groups = await prisma.attempt.groupBy({
    by: ["questionId"],
    where: { userId },
  });
  return groups.length;
};

export const countCompletedSessionsByMode = (userId, mode) => {
  return prisma.practiceSession.count({
    where: { userId, mode, completed: true },
  });
};

// A perfect completed session (all attempts correct, minimum size).
// Scans recent completions — the most recent one may not be the perfect one.
export const findPerfectCompletedSession = async (
  userId,
  minQuestions = 5,
) => {
  const sessions = await prisma.practiceSession.findMany({
    where: { userId, completed: true },
    select: {
      id: true,
      attempts: { select: { isCorrect: true } },
    },
    orderBy: { completedAt: "desc" },
    take: 50,
  });

  return (
    sessions.find(
      (s) =>
        s.attempts.length >= minQuestions &&
        s.attempts.every((a) => a.isCorrect),
    ) ?? null
  );
};

// Distinct UTC activity dates (session starts) for streak evaluation.
export const findActivityDates = async (userId) => {
  const rows = await prisma.practiceSession.findMany({
    where: { userId, completed: true },
    select: { startedAt: true },
    orderBy: { startedAt: "asc" },
  });
  return rows.map((r) => r.startedAt.toISOString().split("T")[0]);
};
