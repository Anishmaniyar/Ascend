import { Router } from "express";
import * as ProfileController from "./profile.controller.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";

const router = Router();

router.get("/", authenticate, ProfileController.getProfile);

router.get("/stats", authenticate, ProfileController.getProfileStats);

router.get("/history", authenticate, ProfileController.getPracticeHistory);

router.get("/heatmap", authenticate, ProfileController.getActivityHeatmap);

router.get("/skills", authenticate, ProfileController.getSkills);

export default router;
