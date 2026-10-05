import AppError from "../../utils/AppError.js";
import * as topicRepository from "./topic.repository.js";

export const getAllTopics = async () => {
  const topics = await topicRepository.findAllTopics();

  return topics;
};

export const getAllSheets = async (userId) => {
  const [sheets, attemptedIds] = await Promise.all([
    topicRepository.findAllSheets(),
    userId
      ? topicRepository.findAttemptedQuestionIds(userId)
      : Promise.resolve([]),
  ]);
  const attempted = new Set(attemptedIds);

  return sheets.map((sheet) => {
    const questionIds = sheet.sheetQuestions.map((sq) => sq.questionId);
    const solved = questionIds.filter((id) => attempted.has(id)).length;
    const total = sheet._count.sheetQuestions;
    return {
      id: sheet.id,
      title: sheet.title,
      description: sheet.description,
      companyName: sheet.companyName,
      difficulty: sheet.difficulty,
      estimatedTime: sheet.estimatedTime,
      questionCount: total,
      solved,
    };
  });
};

export const getSheetQuestions = async (sheetId, userId) => {
  const sheet = await topicRepository.findSheetWithQuestions(sheetId);

  if (!sheet) {
    throw new AppError("Sheet not found", 404);
  }

  const questions = sheet.sheetQuestions.map((sq) => sq.question);
  const attemptedIds = userId
    ? await topicRepository.findAttemptedQuestionIds(userId)
    : [];
  const attempted = new Set(attemptedIds);
  const solved = questions.filter((q) => attempted.has(q.id)).length;

  return {
    id: sheet.id,
    title: sheet.title,
    description: sheet.description,
    companyName: sheet.companyName,
    difficulty: sheet.difficulty,
    estimatedTime: sheet.estimatedTime,
    questions,
    progress: {
      solved,
      total: questions.length,
      percent:
        questions.length === 0
          ? 0
          : Math.round((solved / questions.length) * 100),
    },
  };
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
