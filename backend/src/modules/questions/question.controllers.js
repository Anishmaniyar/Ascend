import asyncHandler from "../../utils/asyncHandler.js";
import * as questionService from "./question.service.js";

export const getQuestions = asyncHandler(async (req, res, next) => {
  const { subtopicId } = req.query;

  const response = await questionService.getQuestions(subtopicId);

  return res.status(200).json({
    success: true,
    message: "Questions fetched successfully",
    data: response,
  });
});

export const getQuestionDetails = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  const response = await questionService.getQuestionDetails(questionId);

  return res.status(200).json({
    success: true,
    message: "Question details fetched successfully",
    data: response,
  });
});
