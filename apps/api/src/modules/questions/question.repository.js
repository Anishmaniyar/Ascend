import prisma from "../../db.js";

export const findQuestionsBySubtopicId = async (subtopicId) => {
  return await prisma.question.findMany({
    where: {
      subtopicId,
    },

    select: {
      id: true,
      title: true,
      difficulty: true,
      type: true,
      // Options without isCorrect/solution: safe for the live practice
      // runner (one request per subtopic instead of N+1 detail fetches).
      options: {
        select: { id: true, text: true },
      },
    },
  });
};

export const findQuestionDetailsById = async (questionId) => {
  return await prisma.question.findFirst({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      title: true,
      difficulty: true,
      type: true,
      options: {
        select: {
          id: true,
          text: true,
        },
      },
    },
  });
};
