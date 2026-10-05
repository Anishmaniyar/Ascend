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

export const findActivePracticeSession = (
  userId,
  subtopicId,
  mode,
  sheetId = null,
) => {
  return prisma.practiceSession.findFirst({
    where: {
      userId: userId,
      mode: mode,
      subtopicId: subtopicId,
      sheetId: sheetId,
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

export const createPracticeSession = (
  userId,
  subtopicId,
  mode,
  sheetId = null,
) => {
  return prisma.practiceSession.create({
    data: {
      userId: userId,
      subtopicId: subtopicId,
      sheetId: sheetId,
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
          topic: { select: { id: true, title: true } },
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
      sheet: {
        include: {
          sheetQuestions: {
            include: {
              question: { include: { options: true } },
            },
          },
        },
      },
    },
  });
};

export const findSheetQuestionsById = (sheetId) => {
  return prisma.sheet.findUnique({
    where: { id: sheetId },
    select: {
      id: true,
      title: true,
      companyName: true,
      sheetQuestions: {
        select: {
          question: {
            select: {
              id: true,
              subtopicId: true,
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

export const findSheetMembership = (sheetId, questionId) => {
  return prisma.sheetQuestion.findUnique({
    where: { sheetId_questionId: { sheetId, questionId } },
    select: { id: true },
  });
};

export const findQuestionSubtopicById = (questionId) => {
  return prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      subtopicId: true,
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
      selectedOptionId,
      isCorrect,
    },
  });
};

export const updatePracticeSession = (sessionId) => {
  return prisma.practiceSession.update({
    where: {
      id: sessionId,
    },
    data: {
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
      userId: true,
      mode: true,
      startedAt: true,
      completedAt: true,
      completed: true,
      subtopic: {
        select: {
          id: true,
          title: true,
          topic: { select: { id: true, title: true } },
        },
      },
    },
  });
};

export const findAttemptsBySession = (sessionId) => {
  return prisma.attempt.findMany({
    where: {
      sessionId,
    },
    select: {
      id: true,
      questionId: true,
      selectedOptionId: true,
      isCorrect: true,
    },
  });
};

// Full review payload: attempt + question (with solution + all options so
// the correct one can be shown post-completion).
export const findAttemptsWithReview = (sessionId) => {
  return prisma.attempt.findMany({
    where: { sessionId },
    select: {
      id: true,
      questionId: true,
      selectedOptionId: true,
      isCorrect: true,
      question: {
        select: {
          id: true,
          title: true,
          difficulty: true,
          type: true,
          solution: true,
          options: {
            select: { id: true, text: true, isCorrect: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};
