import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { getQuestions, getQuestionDetails } from "./question.controllers.js";
import {
  questionIdParamSchema,
  questionsQuerySchema,
} from "./question.validator.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(questionsQuerySchema),
  getQuestions,
);

router.get(
  "/:questionId",
  authenticate,
  validate(questionIdParamSchema),
  getQuestionDetails,
);

export default router;
