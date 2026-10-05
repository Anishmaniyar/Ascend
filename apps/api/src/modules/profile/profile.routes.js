import { Router } from "express";
import * as ProfileController from "./profile.controller.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { updateProfileValidation } from "./profile.validator.js";

const router = Router();

// Reads are self-scoped (req.user.id, no :id param), so one profile:read
// permission covers them; no ownership middleware needed.
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

router.get(
  "/continue",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getContinueSession,
);

router.get(
  "/recommendations",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getRecommendations,
);

router.get(
  "/progress",
  authenticate,
  requirePermission("profile:read"),
  ProfileController.getProgress,
);

// Phase 11: profile update. Ownership is structural — the target is always
// req.user.id → Profile.userId, never a /:userId param, so a user can only
// ever modify their own row.
router.patch(
  "/",
  authenticate,
  requirePermission("profile:update"),
  validate(updateProfileValidation),
  ProfileController.updateProfile,
);

// Phase 12 (V1): clear the custom avatar (falls back to initials).
// Raw image upload lives in front of PATCH / via object storage (see doc).
router.delete(
  "/avatar",
  authenticate,
  requirePermission("profile:update"),
  ProfileController.deleteAvatar,
);

export default router;
