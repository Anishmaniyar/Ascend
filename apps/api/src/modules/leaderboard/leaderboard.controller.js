import asyncHandler from "../../utils/asyncHandler.js";
import * as LeaderboardService from "./leaderboard.service.js";

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { period, sort } = req.query;

  const response = await LeaderboardService.getLeaderboardService(
    req.user.id,
    period,
    sort,
  );

  return res.status(200).json({
    success: true,
    message: "Leaderboard fetched successfully",
    data: response,
  });
});
