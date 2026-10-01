import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import {
  getAllSheets,
  getAllTopics,
  getSubtopicById,
} from "./topic.controllers.js";
import { topicIdParamSchema } from "./topic.validator.js";

const router = Router();

router.get("/", authenticate, getAllTopics);

router.get("/sheets", authenticate, getAllSheets);

router.get(
  "/:id/subtopics",
  authenticate,
  validate(topicIdParamSchema),
  getSubtopicById,
);

export default router;
