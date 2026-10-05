import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as ContestValidator from "./contest.validator.js";
import * as ContestController from "./contest.controller.js";

// Public (authenticated) contest browsing + registration.
export const contestRouter = Router();

contestRouter.get(
  "/",
  authenticate,
  requirePermission("contests:read"),
  ContestController.getContests,
);

contestRouter.get(
  "/:id",
  authenticate,
  requirePermission("contests:read"),
  validate(ContestValidator.contestIdParamValidation),
  ContestController.getContest,
);

contestRouter.post(
  "/:id/register",
  authenticate,
  requirePermission("contests:register"),
  validate(ContestValidator.contestIdParamValidation),
  ContestController.register,
);

contestRouter.delete(
  "/:id/register",
  authenticate,
  requirePermission("contests:register"),
  validate(ContestValidator.contestIdParamValidation),
  ContestController.unregister,
);

// Admin contest management (content writes, ADMIN only).
export const contestAdminRouter = Router();

contestAdminRouter.post(
  "/",
  authenticate,
  requirePermission("contests:create"),
  validate(ContestValidator.createContestValidation),
  ContestController.createContest,
);

contestAdminRouter.patch(
  "/:id",
  authenticate,
  requirePermission("contests:update"),
  validate(ContestValidator.updateContestValidation),
  ContestController.updateContest,
);

contestAdminRouter.delete(
  "/:id",
  authenticate,
  requirePermission("contests:delete"),
  validate(ContestValidator.contestIdParamValidation),
  ContestController.deleteContest,
);
