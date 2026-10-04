import AppError from "../../utils/AppError.js";
import * as questionRepository from "./question.repository.js";

export const getQuestions = async (subtopicId) => {
  const questions =
    await questionRepository.findQuestionsBySubtopicId(subtopicId);

  return questions;
};

export const getQuestionDetails = async (questionId) => {
  const question =
    await questionRepository.findQuestionDetailsById(questionId);

  if (!question) {
    throw new AppError("Question not found", 404);
  }

  return question;
};
