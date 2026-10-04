import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import {
  getAllSheets,
  getAllTopics,
  getSubtopicById,
} from "./topic.controllers.js";
import { topicIdParamSchema } from "./topic.validator.js";

const router = Router();

router.get("/", authenticate, requirePermission("topics:read"), getAllTopics);

router.get(
  "/sheets",
  authenticate,
  requirePermission("sheets:read"),
  getAllSheets,
);

router.get(
  "/:id/subtopics",
  authenticate,
  requirePermission("subtopics:read"),
  validate(topicIdParamSchema),
  getSubtopicById,
);

export default router;
