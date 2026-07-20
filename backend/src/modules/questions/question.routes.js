import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import {
  getQuestions,
  getQuestionDetails,
  submitAnswer,
} from "./question.controllers.js";

const router = Router();

router.get("/", authenticate, getQuestions);

router.get("/:questionId", getQuestionDetails);

router.post("/:questionId/attempt", authenticate, submitAnswer);

export default router;
