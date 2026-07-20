import asyncHandler from "../../utils/asyncHandler.js";
import * as ProfileService from "./profile.service.js";

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getProfileService(userId);

  return res.status(200).json({
    status: "success",
    message: "User Profile data fetched successfullsy",
    data: response,
  });
});

export const getProfileStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getProfileStatsService(userId);

  return res.status(200).json({
    status: "success",
    message: "User Profile stats fetched successfullsy",
    data: response,
  });
});

export const getPracticeHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getPracticeHistoryService(userId);

  return res.status(200).json({
    status: "success",
    message: "User Practice History fetched successfullsy",
    data: response,
  });
});

export const getActivityHeatmap = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ActivityService.getUserHeatmapData(userId);

  return res.status(200).json({
    status: "success",
    message: "User activity analytics timeline generated successfully",
    data: response,
  });
});

export const getSkills = asyncHandler(async (req, res) => {
  const skills = await ProfileService.calculateSkills(req.user.id);

  return res.status(200).json({
    success: true,
    message: "Skills fetched successfully",
    data: skills,
  });
});
