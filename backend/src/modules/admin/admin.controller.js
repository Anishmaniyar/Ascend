import asyncHandler from "../../utils/asyncHandler.js";
import * as AdminService from "./admin.service.js";

export const createTopic = asyncHandler(async (req, res, next) => {
  const adminId = req.user.id;

  const { title, description } = req.body;

  const response = await AdminService.createTopicService(title, description);

  return res.status(201).json({
    status: "success",
    message: "Topic added successfully",
    data: response,
  });
});

export const updateTopic = asyncHandler(async (req, res, next) => {
  const topicId = req.params.id;
  const updateData = req.body;

  const response = await AdminService.updateTopicService(topicId, updateData);

  return res.status(200).json({
    status: "success",
    message: "Topic updated successfully",
    data: response,
  });
});

export const deleteTopic = asyncHandler(async (req, res, next) => {
  const topicId = req.params.id;

  const response = await AdminService.deleteTopicService(topicId);

  return res.status(200).json({
    status: "success",
    message: "Topic deleted successfully",
    data: response,
  });
});

export const createSubTopic = asyncHandler(async (req, res, next) => {
  const { title, description, topicId } = req.body;

  const response = await AdminService.createSubTopicService(
    title,
    description,
    topicId,
  );

  return res.status(201).json({
    status: "success",
    message: "SubTopic created successfully",
    data: response,
  });
});

export const updateSubTopic = asyncHandler(async (req, res, next) => {
  const subtopicId = req.params.id;
  const updateData = req.body;

  const response = await AdminService.updateSubTopicService(
    subtopicId,
    updateData,
  );

  return res.status(200).json({
    status: "success",
    message: "SubTopic updated successfully",
    data: response,
  });
});

export const deleteSubTopic = asyncHandler(async (req, res, next) => {
  const subtopicId = req.params.id;

  const response = await AdminService.deleteSubTopicService(subtopicId);

  return res.status(200).json({
    status: "success",
    message: "SubTopic deleted successfully",
    data: response,
  });
});

export const createQuestion = asyncHandler(async (req, res, next) => {
  const { title, difficulty, type, solution, subtopicId, options } = req.body;

  const response = await AdminService.createQuestionService(
    title,
    difficulty,
    type,
    solution,
    subtopicId,
    options,
  );

  return res.status(201).json({
    status: "success",
    message: "Question created successfully",
    data: response,
  });
});

export const updateQuestion = asyncHandler(async (req, res, next) => {
  const updatedData = req.body;
  const questionId = req.params.id;

  const response = await AdminService.updateQuestionService(
    questionId,
    updatedData,
  );

  return res.status(201).json({
    status: "success",
    message: "Question updated successfully",
    data: response,
  });
});

export const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  await AdminService.deleteQuestionService(questionId);

  return res.status(200).json({
    status: "success",
    message: "Question and its options deleted successfully",
  });
});
