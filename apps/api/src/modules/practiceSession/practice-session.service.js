import AppError from "../../utils/AppError.js";
import * as PracticeRepository from "./practice-session.repository.js";
import { evaluateAchievements } from "../badges/badge.service.js";
import { PRACTICE_MODES } from "./constants.js";

export const createPracticeSessionService = async (
  userId,
  subtopicId,
  mode,
  sheetId = null,
) => {
  const isUserValid = await PracticeRepository.findUserExists(userId);

  if (!isUserValid) {
    throw new AppError("User does not exists", 404);
  }

  if (sheetId) {
    // Company-sheet practice spans subtopics: the session binds to the
    // sheet, and subtopicId is derived for topic-tree grouping only.
    const sheet = await PracticeRepository.findSheetQuestionsById(sheetId);
    if (!sheet) {
      throw new AppError("Sheet not found", 404);
    }
    if (sheet.sheetQuestions.length === 0) {
      throw new AppError("Sheet has no questions yet", 400);
    }
    subtopicId = sheet.sheetQuestions[0].question.subtopicId;
  } else {
    const subtopicExists = await PracticeRepository.findSubTopic(subtopicId);

    if (!subtopicExists) {
      throw new AppError("Sub Topic not found", 404);
    }
  }

  if (!PRACTICE_MODES.includes(mode)) {
    throw new AppError("Mode is not valid", 400);
  }

  const findExistingSession =
    await PracticeRepository.findActivePracticeSession(
      userId,
      subtopicId,
      mode,
      sheetId,
    );

  if (findExistingSession) {
    return findExistingSession;
  }

  const newExistingSession = await PracticeRepository.createPracticeSession(
    userId,
    subtopicId,
    mode,
    sheetId,
  );

  return newExistingSession;
};

const toQuestionDTO = (question) => ({
  id: question.id,
  title: question.title,
  difficulty: question.difficulty,
  type: question.type,
  options: question.options.map(({ id, text }) => ({ id, text })),
});

export const getPracticeSessionById = async (userId, sessionId) => {
  const session = await PracticeRepository.findFullSessionDetails(sessionId);

  if (!session) {
    throw new AppError("Practice session not found", 404);
  }

  if (session.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  // NOTE: active sessions are readable (the live runner fetches its own
  // questions here). Options carry no isCorrect/solution, matching the
  // public question reads, so nothing leaks before completion.

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
    sheetId: session.sheetId,
    sheet: session.sheet
      ? {
          id: session.sheet.id,
          title: session.sheet.title,
          companyName: session.sheet.companyName,
        }
      : null,
    subtopic: {
      id: session.subtopic.id,
      title: session.subtopic.title,
      topic: session.subtopic.topic
        ? {
            id: session.subtopic.topic.id,
            title: session.subtopic.topic.title,
          }
        : null,
    },
    questions: session.sheetId
      ? session.sheet.sheetQuestions.map((sq) => toQuestionDTO(sq.question))
      : formattedQuestions,
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

  // 4. Enforce question membership.
  // Subtopic sessions: attempt.question.subtopicId === session.subtopicId.
  // Without this, attempts for any subtopic's questions could be recorded
  // inside this session, corrupting per-subtopic analytics.
  // Sheet sessions span subtopics: the question must be mapped to the sheet.
  if (practiceSession.sheetId) {
    const member = await PracticeRepository.findSheetMembership(
      practiceSession.sheetId,
      questionId,
    );
    if (!member) {
      throw new AppError(
        "Question does not belong to this session's sheet",
        400,
      );
    }
  } else {
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

  // Phase 16: best-effort achievement evaluation. Runs after the attempt
  // is persisted and never throws (see badge.service) — a badge failure
  // must not fail the practice request. Synchronous for now; promote to a
  // background job only if it shows up in latency profiles (no BullMQ in V1).
  await evaluateAchievements(userId);

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

  // Completion can unlock FIRST_TEST / PERFECT_SESSION.
  await evaluateAchievements(userId);

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

  // Post-completion review: per-question breakdown WITH answers (earned by
  // finishing; the pre-completion reads never include these).
  const detailed = await PracticeRepository.findAttemptsWithReview(sessionId);
  const review = detailed.map((a) => {
    const correctOption = a.question.options.find((o) => o.isCorrect);
    return {
      questionId: a.question.id,
      title: a.question.title,
      difficulty: a.question.difficulty,
      type: a.question.type,
      solution: a.question.solution,
      options: a.question.options.map(({ id, text }) => ({ id, text })),
      selectedOptionId: a.selectedOptionId,
      correctOptionId: correctOption ? correctOption.id : null,
      isCorrect: a.isCorrect,
    };
  });

  return {
    sessionId,
    mode: findSessionExists.mode,
    topic: findSessionExists.subtopic.topic.title,
    subtopic: findSessionExists.subtopic.title,
    score: correctAnswers,
    totalQuestion,
    correctAnswers,
    wrongAnswers,
    accuracy,
    timeTaken,
    startedAt: findSessionExists.startedAt,
    completedAt: findSessionExists.completedAt,
    review,
  };
};
