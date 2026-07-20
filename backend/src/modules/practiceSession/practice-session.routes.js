import { Router } from "express";
import * as PracticeController from "./practice-session.controller.js";
import * as PracticeValidator from "./practice-session.validator.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(PracticeValidator.validateStartPracticeSession),
  PracticeController.startPracticeSession,
);

router.get("/:id", authenticate, PracticeController.getPracticeSession);

router.post(
  "/:id/attempts",
  authenticate,
  validate(PracticeValidator.validateSubmitAttempt),
  PracticeController.submitAnswer,
);

router.patch(
  "/:id/complete",
  authenticate,
  PracticeController.completePracticeSession,
);

router.get("/:id/results", authenticate);

export default router;
