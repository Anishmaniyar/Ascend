import AppError from "../../utils/AppError.js";
import * as topicRepository from "./topic.repository.js";

export const getAllTopics = async (req, res) => {
  const response = await topicRepository.findAllTopics();

  return topics;
};

export const getAllSheets = async (req, res) => {
  const response = await topicRepository.findAllSheets();

  return sheets.map((sheet) => ({
    id: sheet.id,
    title: sheet.title,
    description: sheet.description,
    companyName: sheet.companyName,
    difficulty: sheet.difficulty,
    estimatedTime: sheet.estimatedTime,
    questionCount: sheet._count.questions,
  }));
};

export const getSubTopicById = async (topicId) => {
  const response = await topicRepository.findSubtopicById(topicId);

  return response.map((subtopic) => ({
    id: subtopic.id,
    title: subtopic.title,
    description: subtopic.description,
    questionCount: subtopic._count,
  }));
};
