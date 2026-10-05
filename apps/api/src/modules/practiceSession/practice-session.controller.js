import asyncHandler from "../../utils/asyncHandler.js";
import * as practiceService from "./practice-session.service.js";

export const startPracticeSession = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const { subtopicId, sheetId, mode } = req.body;

  const response = await practiceService.createPracticeSessionService(
    userId,
    subtopicId,
    mode,
    sheetId,
  );

  return res.status(201).json({
    success: true,
    message: "Practice session created successfully",
    data: response,
  });
});

export const getPracticeSession = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const sessionId = req.params.id;

  const response = await practiceService.getPracticeSessionById(
    userId,
    sessionId,
  );

  return res.status(200).json({
    success: true,
    message: "Practice session fetched successfully",
    data: response,
  });
});

export const submitAnswer = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const sessionId = req.params.id;
  const { questionId, selectedOptionId } = req.body;

  const response = await practiceService.submitAttemptService(
    sessionId,
    questionId,
    selectedOptionId,
    userId,
  );

  return res.status(201).json({
    success: true,
    message: "Answer submitted successfully",
    data: response,
  });
});

export const completePracticeSession = asyncHandler(async (req, res, next) => {
  const sessionId = req.params.id;
  const userId = req.user.id;

  const response = await practiceService.completePracticeSessionService(
    userId,
    sessionId,
  );

  return res.status(200).json({
    success: true,
    message: "Practice Session Completed successfully",
    data: response,
  });
});

export const getResults = asyncHandler(async (req, res, next) => {
  const sessionId = req.params.id;
  const userId = req.user.id;

  const response = await practiceService.calculatePracticeResults(
    userId,
    sessionId,
  );

  return res.status(200).json({
    success: true,
    message: "Results fetched successfully",
    data: response,
  });
});
