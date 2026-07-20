import AppError from "../../utils/AppError.js";
import * as PracticeReository from "./practice-session.repository.js";

export const createPracticeSessionService = async (
  userId,
  subtopicId,
  mode,
) => {
  const isUserValid = await PracticeReository.findUserExists(userId);

  if (!isUserValid) {
    throw new AppError("User does not exists", 404);
  }

  const subtopicExists = await PracticeReository.findSubTopic(subtopicId);

  if (!subtopicExists) {
    throw new AppError("Sub Topic not found", 404);
  }

  if (mode != "PRACTICE" && mode != "TEST") {
    throw new AppError("Mode is not valid", 400);
  }

  const findExistingSession = await PracticeReository.findExistingSession(
    userId,
    subtopicId,
    mode,
  );

  if (findExistingSession) {
    return findExistingSession;
  }

  const newExistingSession = await PracticeReository.createPraticeSession(
    userId,
    subtopicId,
    mode,
  );

  return newExistingSession;
};

export const getPracticeSessionById = async (userId, sessionId) => {
  const session = await PracticeReository.findFullSessionDetails(sessionId);

  if (!session) {
    throw new AppError("Practice session not found", 404);
  }

  if (session.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  if (!session.completed) {
    throw new AppError("Cannot access session data until it is completed", 400);
  }

  const formattedQuestions = session.subtopic.questions.map((question) => {
    return {
      id: question.id,
      text: question.text,
      options: question.options.map(({ id, text }) => ({ id, text })),
    };
  });

  return {
    id: session.id,
    mode: session.mode,
    completed: session.completed,
    startedAt: session.startedAt,
    subtopic: {
      id: session.subtopic.id,
      title: session.subtopic.title,
    },
    questions: formattedQuestions,
  };
};

// Validates parameters against core business rules and saves user answers
export const submitAttemptService = async (
  sessionId,
  questionId,
  selectedOptionId,
  userId,
) => {
  // 1. Check option availability
  const option = await PracticeRepository.findOptionById(selectedOptionId);
  if (!option) {
    throw new AppError("Option not found", 404);
  }

  // 2. Enforce relation consistency
  if (option.questionId !== questionId) {
    throw new AppError("Selected option does not belong to this question", 400);
  }

  // 3. Confirm target session existence, identity, and accessibility
  const practiceSession =
    await PracticeRepository.findFullSessionDetails(sessionId);
  if (!practiceSession) {
    throw new AppError("Practice session not found", 404);
  }

  // 4. Verify identity alignment
  if (practiceSession.userId !== userId) {
    throw new AppError("Access Denied: You do not own this session", 403);
  }

  // 5. Block inputs on finalized sessions
  if (practiceSession.completed) {
    throw new AppError("Cannot submit answers to a completed session", 400);
  }

  // 6. Block double submissions to ensure clean analytics and historical metrics
  const existingAttempt = await PracticeRepository.findAttempt(
    userId,
    sessionId,
    questionId,
  );
  if (existingAttempt) {
    throw new AppError("You have already attempted this question", 409); // 409 Conflict
  }

  // 7. Write data once all business conditions clear safely
  const newAttempt = await PracticeRepository.createAttempt(
    userId,
    sessionId,
    questionId,
    selectedOptionId,
    option.isCorrect, // Directly pull value loaded from step 1
  );

  // Return formatted resource metadata to service layout
  return {
    id: newAttempt.id,
    sessionId: newAttempt.sessionId,
    questionId: newAttempt.questionId,
    isCorrect: newAttempt.isCorrect,
  };
};

export const completePraticeSessionService = async (userId, sessionId) => {
  const practiceSession =
    await PracticeRepository.findFullSessionDetails(sessionId);
  if (!practiceSession) {
    throw new AppError("Practice session not found", 404);
  }

  // 4. Verify identity alignment
  if (practiceSession.userId !== userId) {
    throw new AppError("Access Denied: You do not own this session", 403);
  }

  // 5. Block inputs on finalized sessions
  if (practiceSession.completed) {
    throw new AppError("Session already completed", 400);
  }

  const updatePracticeSession = await PracticeReository.updatePracticeSession(
    userId,
    sessionId,
  );

  return updatePracticeSession;
};

export const calculatePracticeResults = async (sessionId) => {
  const findSessionExists = await PracticeReository.findSessionById(sessionId);

  if (!findSessionExists) {
    throw new AppError("Session does not exists", 404);
  }

  const attempts = await PracticeReository.findAttemptsBySession(sessionId);

  const totalQuestion = attempts.length;

  const correctAnswers = attempts.filter((attempt) => attempt.isCorrect).length;

  const wrongAnswers = totalQuestion - correctAnswers;

  const accuracy =
    totalQuestion === 0
      ? 0
      : Number(((correctAnswers / totalQuestion) * 100).toFixed(2));

  const timeTaken = session.completedAt.getTime() - session.startedAt.getTime();

  return {
    score: correctAnswers,
    totalQuestion,
    correctAnswers,
    wrongAnswers,
    accuracy,
    timeTaken,
  };
};
