import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import {
  getAllSheets,
  getAllTopics,
  getSubtopicById,
} from "./topic.controllers.js";

const router = Router();

router.get("/", getAllTopics);

router.get("/sheets", getAllSheets);

router.get("/:topicsId/subtopics", getSubtopicById);

export default router;
