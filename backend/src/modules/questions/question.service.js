import * as questionRepository from "./question.repository.js";

export const getQuestions = async (subtopicId) => {
  return await questionRepository.findQuestionsBySubtopicId(subtopicId);
};

export const getQuestionDetails = async (questionId) => {
  return await questionRepository.findQuestionDetailsById(questionId);
};
