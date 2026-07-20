import asyncHandler from "../../utils/asyncHandler.js";
import * as questionService from "./question.service.js";

export const getQuestions = asyncHandler(async (req, res, next) => {
  const { subtopicId } = req.query;

  const questions = await questionService.getQuestions(subtopicId);

  return res.status(200).json({
    success: true,
    message: "Questions fetched successfully",
    data: questions,
  });
});

export const getQuestionDetails = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  const response = await questionService.getQuestionDetails(questionId);

  return res.status(200).json({
    success: true,
    message: "Questions details fetched successfully",
    data: questions,
  });
});

export const submitAnswer = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;

  const { questionId, selectedOptionId } = req.body;

  const response = await attemptService.submitAttempt(
    sessionId,
    questionId,
    selectedOptionId,
  );

  return res.status(200).json({
    status: "success",
    message: "Answer was submitted successfully",
    data: {
      response,
    },
  });
});
