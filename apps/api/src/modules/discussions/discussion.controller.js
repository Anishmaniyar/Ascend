import asyncHandler from "../../utils/asyncHandler.js";
import * as DiscussionService from "./discussion.service.js";

export const getDiscussions = asyncHandler(async (req, res, next) => {
  const response = await DiscussionService.listDiscussionsService();

  return res.status(200).json({
    success: true,
    message: "Discussions fetched successfully",
    data: response,
  });
});

export const createDiscussion = asyncHandler(async (req, res, next) => {
  const response = await DiscussionService.createDiscussionService(
    req.user.id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    message: "Discussion created successfully",
    data: response,
  });
});
