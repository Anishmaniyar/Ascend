import asyncHandler from "../../utils/asyncHandler.js";
import * as ProfileService from "./profile.service.js";

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getProfileService(userId);

  return res.status(200).json({
    success: true,
    message: "User profile data fetched successfully",
    data: response,
  });
});

export const getProfileStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getProfileStatsService(userId);

  return res.status(200).json({
    success: true,
    message: "User profile stats fetched successfully",
    data: response,
  });
});

export const getPracticeHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getPracticeHistoryService(userId);

  return res.status(200).json({
    success: true,
    message: "User practice history fetched successfully",
    data: response,
  });
});

export const getActivityHeatmap = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getUserHeatmapData(userId);

  return res.status(200).json({
    success: true,
    message: "User activity analytics timeline generated successfully",
    data: response,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.updateProfileService(userId, req.body);

  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: response,
  });
});

// Phase 12 (V1): avatar is a URL field on Profile. Raw image upload goes
// Frontend → object storage → avatarUrl → PATCH /profile (see design doc).
// This endpoint clears a custom avatar (falls back to initials/Google image).
export const deleteAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.clearAvatarService(userId);

  return res.status(200).json({
    success: true,
    message: "Profile avatar removed successfully",
    data: response,
  });
});

export const getContinueSession = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getContinueSessionService(userId);

  return res.status(200).json({
    success: true,
    message: "Continue-practice session fetched successfully",
    data: response,
  });
});

export const getRecommendations = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.getRecommendationsService(userId);

  return res.status(200).json({
    success: true,
    message: "Topic recommendations fetched successfully",
    data: response,
  });
});

export const getSkills = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await ProfileService.calculateSkills(userId);

  return res.status(200).json({
    success: true,
    message: "Skills fetched successfully",
    data: response,
  });
});
