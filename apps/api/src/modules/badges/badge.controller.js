import asyncHandler from "../../utils/asyncHandler.js";
import * as BadgeService from "./badge.service.js";

export const getMyBadges = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const response = await BadgeService.listBadgesForUser(userId);

  return res.status(200).json({
    success: true,
    message: "User badges fetched successfully",
    data: response,
  });
});
