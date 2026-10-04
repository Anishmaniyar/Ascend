import AppError from "../../utils/AppError.js";
import * as PracticeRepository from "./practice-session.repository.js";
import { PRACTICE_MODES } from "./constants.js";

export const createPracticeSessionService = async (
  userId,
  subtopicId,
  mode,
) => {
  const isUserValid = await PracticeRepository.findUserExists(userId);

  if (!isUserValid) {
    throw new AppError("User does not exists", 404);
  }

  const subtopicExists = await PracticeRepository.findSubTopic(subtopicId);

  if (!subtopicExists) {
    throw new AppError("Sub Topic not found", 404);
  }

  if (!PRACTICE_MODES.includes(mode)) {
    throw new AppError("Mode is not valid", 400);
  }

  const findExistingSession =
    await PracticeRepository.findActivePracticeSession(
      userId,
      subtopicId,
      mode,
    );

  if (findExistingSession) {
    return findExistingSession;
  }

  const newExistingSession = await PracticeRepository.createPracticeSession(
    userId,
    subtopicId,
    mode,
  );

  return newExistingSession;
};

export const getPracticeSessionById = async (userId, sessionId) => {
  const session = await PracticeRepository.findFullSessionDetails(sessionId);

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
      title: question.title,
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

  // 4. Enforce attempt.question.subtopicId === attempt.session.subtopicId.
  // Without this, attempts for any subtopic's questions could be recorded
  // inside this session, corrupting per-subtopic analytics.
  const targetQuestion =
    await PracticeRepository.findQuestionSubtopicById(questionId);
  if (!targetQuestion) {
    throw new AppError("Question not found", 404);
  }
  if (targetQuestion.subtopicId !== practiceSession.subtopicId) {
    throw new AppError(
      "Question does not belong to this session's subtopic",
      400,
    );
  }

  // 5. Verify identity alignment
  if (practiceSession.userId !== userId) {
    throw new AppError("Access Denied: You do not own this session", 403);
  }

  // 6. Block inputs on finalized sessions
  if (practiceSession.completed) {
    throw new AppError("Cannot submit answers to a completed session", 400);
  }

  // 7. Block double submissions to ensure clean analytics and historical metrics
  const existingAttempt = await PracticeRepository.findAttempt(
    userId,
    sessionId,
    questionId,
  );
  if (existingAttempt) {
    throw new AppError("You have already attempted this question", 409); // 409 Conflict
  }

  // 8. Write data once all business conditions clear safely.
  // Consistency boundary: single-row insert, so no transaction is needed.
  // The DB unique key on (sessionId, questionId) is the final guard:
  // if two requests pass step 7 at the same time, the loser hits P2002.
  let newAttempt;
  try {
    newAttempt = await PracticeRepository.createAttempt(
      userId,
      sessionId,
      questionId,
      selectedOptionId,
      option.isCorrect, // Directly pull value loaded from step 1
    );
  } catch (error) {
    if (error && error.code === "P2002") {
      throw new AppError("You have already attempted this question", 409);
    }
    throw error;
  }

  // Return formatted resource metadata to service layout
  return {
    id: newAttempt.id,
    sessionId: newAttempt.sessionId,
    questionId: newAttempt.questionId,
    isCorrect: newAttempt.isCorrect,
  };
};

export const completePracticeSessionService = async (userId, sessionId) => {
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

  const updatePracticeSession =
    await PracticeRepository.updatePracticeSession(sessionId);

  return updatePracticeSession;
};

export const calculatePracticeResults = async (userId, sessionId) => {
  const findSessionExists = await PracticeRepository.findSessionById(sessionId);

  if (!findSessionExists) {
    throw new AppError("Session does not exists", 404);
  }

  if (findSessionExists.userId !== userId) {
    throw new AppError("Access Denied: You do not own this session", 403);
  }

  const attempts = await PracticeRepository.findAttemptsBySession(sessionId);

  const totalQuestion = attempts.length;

  const correctAnswers = attempts.filter((attempt) => attempt.isCorrect).length;

  const wrongAnswers = totalQuestion - correctAnswers;

  const accuracy =
    totalQuestion === 0
      ? 0
      : Number(((correctAnswers / totalQuestion) * 100).toFixed(2));

  if (!findSessionExists.completedAt) {
    throw new AppError("Session is not completed yet", 400);
  }

  const timeTaken =
    findSessionExists.completedAt.getTime() -
    findSessionExists.startedAt.getTime();

  return {
    score: correctAnswers,
    totalQuestion,
    correctAnswers,
    wrongAnswers,
    accuracy,
    timeTaken,
  };
};
