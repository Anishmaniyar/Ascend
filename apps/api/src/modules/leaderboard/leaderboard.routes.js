import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { leaderboardQuerySchema } from "./leaderboard.validator.js";
import { getLeaderboard } from "./leaderboard.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("leaderboard:read"),
  validate(leaderboardQuerySchema),
  getLeaderboard,
);

export default router;
