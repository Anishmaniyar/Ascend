import prisma from "../../db.js";

// Period window (UTC): weekly = since Monday 00:00, monthly = since the 1st.
export const periodStart = (period) => {
  const now = new Date();
  if (period === "weekly") {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return d;
  }
  if (period === "monthly") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
  return null;
};

const inWindow = (start) => (start ? { gte: start } : undefined);

export const aggregateForLeaderboard = async (period) => {
  const start = periodStart(period);
  const attemptWhere = start ? { createdAt: inWindow(start) } : {};
  const sessionWhere = start
    ? { completed: true, startedAt: inWindow(start) }
    : { completed: true };

  const [correctTotals, uniquePairs, sessionTotals, users] =
    await Promise.all([
      prisma.attempt.groupBy({
        by: ["userId"],
        where: { ...attemptWhere, isCorrect: true },
        _count: { _all: true },
      }),
      prisma.attempt.groupBy({
        by: ["userId", "questionId"],
        where: attemptWhere,
      }),
      prisma.practiceSession.groupBy({
        by: ["userId"],
        where: sessionWhere,
        _count: { _all: true },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          currentStreak: true,
          profile: { select: { displayName: true } },
        },
      }),
    ]);

  const correctByUser = new Map(
    correctTotals.map((g) => [g.userId, g._count._all]),
  );
  const uniqueByUser = new Map();
  for (const g of uniquePairs) {
    uniqueByUser.set(g.userId, (uniqueByUser.get(g.userId) || 0) + 1);
  }
  const sessionsByUser = new Map(
    sessionTotals.map((g) => [g.userId, g._count._all]),
  );

  return users.map((u) => {
    const solved = uniqueByUser.get(u.id) || 0;
    const correct = correctByUser.get(u.id) || 0;
    return {
      userId: u.id,
      name: u.profile?.displayName || u.name,
      solved,
      // Same convention as profile stats: correct attempts / unique solved.
      accuracy: solved === 0 ? 0 : Math.round((correct / solved) * 100),
      sessions: sessionsByUser.get(u.id) || 0,
      streak: u.currentStreak || 0,
      // Score rewards correct answers in the window (transparent, documented).
      score: correct,
    };
  });
};
