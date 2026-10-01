import AppError from "../../utils/AppError.js";
import * as topicRepository from "./topic.repository.js";

export const getAllTopics = async () => {
  const topics = await topicRepository.findAllTopics();

  return topics;
};

export const getAllSheets = async () => {
  const sheets = await topicRepository.findAllSheets();

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
  const topicExists = await topicRepository.findTopicById(topicId);

  if (!topicExists) {
    throw new AppError("Topic not found", 404);
  }

  const subtopics = await topicRepository.findSubtopicById(topicId);

  return subtopics.map((subtopic) => ({
    id: subtopic.id,
    title: subtopic.title,
    description: subtopic.description,
    questionCount: subtopic._count.questions,
  }));
};
