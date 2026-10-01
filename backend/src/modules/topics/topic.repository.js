import prisma from "../../db.js";

export const findAllTopics = async () => {
  return await prisma.topic.findMany({
    select: {
      id: true,
      title: true,
      description: true,
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
          questions: true,
        },
      },
    },

    orderBy: {
      companyName: "asc",
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
