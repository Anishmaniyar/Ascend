import prisma from "../../db.js";

export const findTopicByTitle = (title) => {
  return prisma.topic.findFirst({
    where: {
      title,
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
};

export const createTopic = (title, description) => {
  return prisma.topic.create({
    data: {
      title,
      description,
    },
  });
};

export const findTopicById = (topicId) => {
  return prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
    },
  });
};

export const updateTopic = (topicId, updateData) => {
  return prisma.topic.update({
    where: {
      id,
    },
    data: {
      title: updateData.title,
      description: updateData.description,
    },
  });
};

export const deleteTopicById = (topicId) => {
  return prisma.topic.delete({
    where: {
      id: topicId,
    },
  });
};

export const findSubTopicByTitleAndTopic = (title, topicId) => {
  return prisma.subtopic.findFirst({
    where: {
      topicId,
      title,
    },
    select: {
      id: true,
      title: true,
      topicId: true,
    },
  });
};

export const createSubTopic = (title, description, topicId) => {
  return prisma.subtopic.create({
    data: {
      title,
      description,
      topicId,
    },
  });
};

export const findSubTopicById = (subtopicId) => {
  return prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      title: true,
      topicId: true,
    },
  });
};

export const updateSubTopic = (subtopicId, updateData) => {
  return prisma.subtopic.update({
    where: {
      id: subtopicId,
    },
    data: updateData,
  });
};

export const deleteSubTopicById = (subtopicId) => {
  return prisma.subtopic.delete({
    where: {
      id: subtopicId,
    },
  });
};

export const createQuestion = (
  title,
  difficulty,
  type,
  solution,
  subtopicId,
  options,
) => {
  return prisma.question.create({
    data: {
      title,
      difficulty,
      type,
      solution,
      subtopicId,
      options: {
        createMany: {
          data: options,
        },
      },
    },

    include: {
      options: true,
    },
  });
};

export const findQuestionWithOptions = (id) => {
  return prisma.question.findUnique({
    where: { id },
    include: { options: true },
  });
};

export const updateQuestion = async (questionId, updateData) => {
  const { options, ...questionFields } = updateData;

  // Build the database transaction payload dynamically
  const prismaPayload = {
    where: { id: questionId },
    data: {
      ...questionFields, // Updates text, difficulty, subtopicId, etc.
    },
    include: { options: true },
  };

  // If options were passed, leverage prisma upsert structures inside update
  if (options) {
    // Strategy: Clean slate approach (delete old options, write new ones) is safest for clean edits
    prismaPayload.data.options = {
      deleteMany: {}, // Deletes previous option assignments safely
      createMany: {
        data: options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      },
    };
  }

  return prisma.question.update(prismaPayload);
};

// Deletion engine
export const deleteQuestionById = (id) => {
  return prisma.question.delete({
    where: { id },
  });
};
