import prisma from "../../db.js";

export const findProfileById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
    },
  });
};

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

export const findPracticeHistory = async (userId) => {
  return await prisma.practiceSession.findMany({
    where: {
      userId,
      completed: true,
    },

    select: {
      id: true,
      mode: true,
      completedAt: true,

      subtopic: {
        select: {
          title: true,
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
          subtopic: {
            select: {
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
