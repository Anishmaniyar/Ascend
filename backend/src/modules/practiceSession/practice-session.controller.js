import asyncHandler from "../../utils/asyncHandler.js";
import * as PracticeService from "./practice-session.service.js";

export const startPracticeSession = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const { subtopicId, mode } = req.body;

  const response = await PracticeService.createPracticeSessionService(
    userId,
    subtopicId,
    mode,
  );

  return res.status(201).json({
    status: "success",
    message: "Practice session created successfully",
    data: response,
  });
});

export const getPracticeSession = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const sessionId = req.params.id;

  const response = await PracticeService.getPracticeSessionById(
    userId,
    sessionId,
  );

  return res.status(200).json({
    status: "success",
    message: "Practice session fetched successfully",
    data: response,
  });
});

export const submitAnswer = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const sessionId = req.params.id;
  const { questionId, selectedOptionId } = req.body;

  const response = await PracticeService.submitAttemptService(
    sessionId,
    questionId,
    selectedOptionId,
    userId,
  );

  return res.status(201).json({
    status: "success",
    message: "Answer submitted successfully",
    data: response,
  });
});

export const completePracticeSession = asyncHandler(async (req, res, next) => {
  const sessionId = req.params.id;
  const userId = req.user.id;

  const response = await PracticeService.completePraticeSessionService(
    userId,
    sessionId,
  );

  return res.status(200).json({
    status: "success",
    message: "Practice Session Completed successfully",
    data: response,
  });
});

export const getResults = asyncHandler(async (req, res, next) => {
  const sessionId = req.params.id;

  const response = await PracticeService.calculatePracticeResults(sessionId);

  return res.status(200).json({
    status: "success",
    message: "Results fetched successfully",
    data: response,
  });
});
