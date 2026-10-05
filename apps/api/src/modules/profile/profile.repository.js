import prisma from "../../db.js";

// ---------------------------------------------------------------------------
// Identity (Phase 9: repository fetches User + Profile, Prisma only —
// no calculations, no DTO shaping; that lives in profile.service.js).
// ---------------------------------------------------------------------------

export const findUserWithProfile = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      currentStreak: true,
      longestStreak: true,
      // Legacy columns kept until the backfill migration drops them.
      avatar: true,
      bio: true,
      profile: true,
    },
  });
};

export const findProfileByHandle = (handle) => {
  return prisma.profile.findUnique({
    where: { handle },
    select: { userId: true, handle: true },
  });
};

export const createProfileForUser = (userId, data) => {
  return prisma.profile.create({
    data: { userId, ...data },
  });
};

export const updateProfileByUserId = (userId, data) => {
  return prisma.profile.update({
    where: { userId },
    data,
  });
};

export const upsertProfileForUser = (userId, data) => {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

// ---------------------------------------------------------------------------
// Derived-data fetchers (raw reads for the service layer).
// ---------------------------------------------------------------------------

export const findUserStats = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      currentStreak: true,
      longestStreak: true,
    },
  });
};

export const countUniqueQuestionsSolved = async (userId) => {
  const groups = await prisma.attempt.groupBy({
    by: ["questionId"],
    where: {
      userId,
    },
  });

  return groups.length;
};

export const countCorrectAttempts = async (userId) => {
  return await prisma.attempt.count({
    where: {
      userId,
      isCorrect: true,
    },
  });
};

export const countPracticeSessions = async (userId) => {
  return await prisma.practiceSession.count({
    where: {
      userId,
    },
  });
};

export const countSessionsByMode = async (userId, mode) => {
  return await prisma.practiceSession.count({
    where: { userId, mode },
  });
};

// Curriculum totals per difficulty (denominators for the stats breakdown).
export const countQuestionsByDifficulty = async () => {
  const groups = await prisma.question.groupBy({
    by: ["difficulty"],
    _count: { _all: true },
  });

  const totals = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const g of groups) {
    totals[g.difficulty] = g._count._all;
  }
  return totals;
};

// Attempts with their question difficulty (numerators for the breakdown).
export const findAttemptsWithDifficulty = async (userId) => {
  return await prisma.attempt.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      question: { select: { difficulty: true } },
    },
  });
};

export const findPracticeHistory = async (userId) => {
  return await prisma.practiceSession.findMany({
    where: {
      userId,
      completed: true,
    },

    select: {
      id: true,
      mode: true,
      startedAt: true,
      completedAt: true,

      subtopic: {
        select: {
          title: true,
          topic: { select: { title: true } },
        },
      },

      attempts: {
        select: {
          isCorrect: true,
        },
      },
    },

    orderBy: {
      completedAt: "desc",
    },
  });
};

export const getUserDailyActivityCounts = (userId) => {
  return prisma.practiceSession.findMany({
    where: {
      userId: userId,
      completed: true,
    },
    select: {
      startedAt: true,
    },
    orderBy: {
      startedAt: "asc",
    },
  });
};

export const findAttemptsWithTopics = async (userId) => {
  return await prisma.attempt.findMany({
    where: {
      userId,
    },
    select: {
      isCorrect: true,
      question: {
        select: {
          difficulty: true,
          subtopic: {
            select: {
              id: true,
              title: true,
              topic: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const countQuestionsInSubtopic = async (subtopicId) => {
  return await prisma.question.count({
    where: { subtopicId },
  });
};

// Curriculum tree with per-subtopic question counts (progress denominators).
export const findCurriculumTree = async () => {
  return await prisma.topic.findMany({
    select: {
      id: true,
      title: true,
      subtopics: {
        select: {
          id: true,
          title: true,
          _count: { select: { questions: true } },
        },
        orderBy: { title: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });
};

// All attempts with topic/subtopic/difficulty context (progress numerators).
export const findAttemptsForProgress = async (userId) => {
  return await prisma.attempt.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      createdAt: true,
      questionId: true,
      question: {
        select: {
          difficulty: true,
          subtopic: {
            select: {
              id: true,
              title: true,
              topic: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
  });
};

export const findCompletedSessionsForProgress = async (userId) => {
  return await prisma.practiceSession.findMany({
    where: { userId, completed: true },
    select: { mode: true, startedAt: true, completedAt: true },
    orderBy: { completedAt: "asc" },
  });
};

export const countAllSessions = async (userId) => {
  return await prisma.practiceSession.count({ where: { userId } });
};

// Most recently started incomplete session (resume target for continue).
export const findMostRecentActiveSession = async (userId) => {
  return await prisma.practiceSession.findFirst({
    where: { userId, completed: false },
    select: {
      id: true,
      mode: true,
      startedAt: true,
      subtopic: {
        select: {
          id: true,
          title: true,
          topic: { select: { title: true } },
        },
      },
      attempts: {
        select: { isCorrect: true },
      },
    },
    orderBy: { startedAt: "desc" },
  });
};
