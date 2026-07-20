import prisma from "../../db.js";

export const findUserExists = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
};

export const findSubTopic = (subtopicId) => {
  return prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
    },
  });
};

export const findActivePracticeSession = (userId, subtopicId, mode) => {
  return prisma.practiceSession.findFirst({
    where: {
      userId: userId,
      mode: mode,
      subtopicId: subtopicId,
      completed: false,
    },

    select: {
      id: true,
      mode: true,
      currentQuestionIndex: true,
      startedAt: true,
      subtopic: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });
};

export const createPraticeSession = (userId, subtopicId, mode) => {
  return prisma.practiceSession.create({
    data: {
      userId: userId,
      subtopicId: subtopicId,
      mode: mode,
    },
  });
};

export const findFullSessionDetails = (sessionId) => {
  return prisma.practiceSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      subtopic: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
};

export const findOptionById = (selectedOptionId) => {
  return prisma.option.findUnique({
    where: {
      id: selectedOptionId,
    },
    select: {
      id: true,
      text: true,
      isCorrect: true,
      questionId: true,
    },
  });
};

export const findAttempt = (userId, sessionId, questionId) => {
  return prisma.attempt.findFirst({
    where: { userId, sessionId, questionId },
    select: { id: true },
  });
};

export const createAttempt = (
  userId,
  sessionId,
  questionId,
  selectedOptionId,
  isCorrect,
) => {
  return prisma.attempt.create({
    data: {
      userId,
      sessionId,
      questionId,
      optionId: selectedOptionId,
      isCorrect,
    },
  });
};

export const updatePracticeSession = (userId, sessionId) => {
  return prisma.practiceSession.update({
    where: {
      id: sessionId,
      userId: userId,
      completed: true,
      completedAt: new Date(),
    },
  });
};

export const findSessionById = (sessionId) => {
  return prisma.practiceSession.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      id: true,
      startedAt: true,
      completedAt: true,
      completed: true,
    },
  });
};

export const findAttemptsBySession = (sessionId) => {
  return prisma.attempt.findMany({
    where: {
      id: sessionId,
    },
    select: {
      id: true,
      selectedOption: true,
      isCorrect: true,
    },
  });
};
