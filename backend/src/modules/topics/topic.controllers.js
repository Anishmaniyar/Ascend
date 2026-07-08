import asyncHandler from "../../utils/asyncHandler.js";
import * as topicService from "./topic.service.js";

export const getAllTopics = asyncHandler(async (req, res, next) => {
  const response = await topicService.getAllTopics();

  return res.status(200).json({
    status: "success",
    message: "Topics fetched successfully",
    data: {
      response,
    },
  });
});

export const getAllSheets = asyncHandler(async (req, res, next) => {
  const response = await topicService.getAllSheets();

  return res.status(200).json({
    status: "success",
    message: "Company sheets fetched successfully",
    data: {
      response,
    },
  });
});

export const getSubtopicById = asyncHandler(async (req, res, next) => {
  const topicId = req.params.id;

  const response = await topicService.getSubTopicById(topicId);

  return res.status(200).json({
    success: true,
    message: "Subtopics fetched successfully",
    data: response,
  });
});
