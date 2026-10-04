import { Router } from "express";
import * as ProfileController from "./profile.controller.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";

const router = Router();

// All profile reads are self-scoped (req.user.id, no :id param), so one
// profile:read permission covers them; no ownership middleware needed.
router.get(
  "/",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getProfile,
);

router.get(
  "/stats",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getProfileStats,
);

router.get(
  "/history",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getPracticeHistory,
);

router.get(
  "/heatmap",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getActivityHeatmap,
);

router.get(
  "/skills",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getSkills,
);

export default router;
