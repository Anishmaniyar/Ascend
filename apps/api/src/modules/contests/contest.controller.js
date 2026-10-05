import asyncHandler from "../../utils/asyncHandler.js";
import * as ContestService from "./contest.service.js";

export const getContests = asyncHandler(async (req, res, next) => {
  const response = await ContestService.listContestsService(req.user.id);

  return res.status(200).json({
    success: true,
    message: "Contests fetched successfully",
    data: response,
  });
});

export const getContest = asyncHandler(async (req, res, next) => {
  const response = await ContestService.getContestService(
    req.params.id,
    req.user.id,
  );

  return res.status(200).json({
    success: true,
    message: "Contest fetched successfully",
    data: response,
  });
});

export const register = asyncHandler(async (req, res, next) => {
  const response = await ContestService.registerService(
    req.params.id,
    req.user.id,
  );

  return res.status(201).json({
    success: true,
    message: "Registered for contest successfully",
    data: response,
  });
});

export const unregister = asyncHandler(async (req, res, next) => {
  const response = await ContestService.unregisterService(
    req.params.id,
    req.user.id,
  );

  return res.status(200).json({
    success: true,
    message: "Contest registration removed successfully",
    data: response,
  });
});

export const createContest = asyncHandler(async (req, res, next) => {
  const response = await ContestService.createContestService(req.body);

  return res.status(201).json({
    success: true,
    message: "Contest created successfully",
    data: response,
  });
});

export const updateContest = asyncHandler(async (req, res, next) => {
  const response = await ContestService.updateContestService(
    req.params.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Contest updated successfully",
    data: response,
  });
});

export const deleteContest = asyncHandler(async (req, res, next) => {
  const response = await ContestService.deleteContestService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Contest deleted successfully",
    data: response,
  });
});
