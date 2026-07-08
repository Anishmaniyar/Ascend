import asyncHandler from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res, next) => {
  const { data } = req.body;

  const response = await authService.registerUser(data);

  return res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      response,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { data } = req.body;

  const response = await authService.authenticateUser(data);

  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      response,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await authService.getCurrentUser(userId);

  return res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: {
      response,
    },
  });
});
