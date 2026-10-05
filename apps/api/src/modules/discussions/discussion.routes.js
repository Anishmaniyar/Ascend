import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createDiscussionValidation } from "./discussion.validator.js";
import * as DiscussionController from "./discussion.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("discussions:read"),
  DiscussionController.getDiscussions,
);

router.post(
  "/",
  authenticate,
  requirePermission("discussions:create"),
  validate(createDiscussionValidation),
  DiscussionController.createDiscussion,
);

export default router;
