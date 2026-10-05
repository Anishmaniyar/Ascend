import prisma from "../../db.js";

export const findAllTopics = async () => {
  return await prisma.topic.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      // Subtopic shell for topic cards (counts only; solved counts come
      // from GET /profile/progress so this stays a cheap curriculum read).
      subtopics: {
        select: {
          id: true,
          title: true,
          _count: { select: { questions: true } },
        },
        orderBy: { title: "asc" },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const findTopicById = async (topicId) => {
  return await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
    },
  });
};

export const findAllSheets = async () => {
  return await prisma.sheet.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      difficulty: true,
      estimatedTime: true,

      _count: {
        select: {
          sheetQuestions: true,
        },
      },

      sheetQuestions: {
        select: { questionId: true },
      },
    },

    orderBy: {
      companyName: "asc",
    },
  });
};

// Distinct questionIds the user has attempted (progress denominator reads).
export const findAttemptedQuestionIds = async (userId) => {
  const groups = await prisma.attempt.groupBy({
    by: ["questionId"],
    where: { userId },
  });
  return groups.map((g) => g.questionId);
};

export const findSheetWithQuestions = async (sheetId) => {
  return await prisma.sheet.findUnique({
    where: { id: sheetId },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      difficulty: true,
      estimatedTime: true,
      sheetQuestions: {
        select: {
          question: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              type: true,
              options: { select: { id: true, text: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

export const findSubtopicById = async (topicId) => {
  return await prisma.subtopic.findMany({
    where: {
      topicId: topicId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
};
