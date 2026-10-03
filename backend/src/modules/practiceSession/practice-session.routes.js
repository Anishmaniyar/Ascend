import { Router } from "express";
import * as PracticeController from "./practice-session.controller.js";
import * as PracticeValidator from "./practice-session.validator.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { requirePracticeSessionOwnership } from "../../middleware/practiceOwnership.middleware.js";
import validate from "../../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("practice:create"),
  validate(PracticeValidator.validateStartPracticeSession),
  PracticeController.startPracticeSession,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("practice:read"),
  requirePracticeSessionOwnership,
  validate(PracticeValidator.validateSessionIdParam),
  PracticeController.getPracticeSession,
);

router.post(
  "/:id/attempts",
  authenticate,
  requirePermission("attempts:create"),
  requirePracticeSessionOwnership,
  validate(PracticeValidator.validateSubmitAttempt),
  PracticeController.submitAnswer,
);

router.patch(
  "/:id/complete",
  authenticate,
  requirePermission("practice:complete"),
  requirePracticeSessionOwnership,
  validate(PracticeValidator.validateSessionIdParam),
  PracticeController.completePracticeSession,
);

router.get(
  "/:id/results",
  authenticate,
  requirePermission("results:read"),
  requirePracticeSessionOwnership,
  validate(PracticeValidator.validateSessionIdParam),
  PracticeController.getResults,
);

export default router;
