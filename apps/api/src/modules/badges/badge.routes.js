import { Router } from "express";
import * as BadgeController from "./badge.controller.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";

const router = Router();

// Mounted at /profile/badges → GET /api/v1/profile/badges.
// Self-scoped like every other profile read (profile:read covers it).
router.get(
  "/",
  authenticate,
  requirePermission("profile:read"),
  BadgeController.getMyBadges,
);

export default router;
