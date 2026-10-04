import { Router } from "express";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as AdminValidator from "./admin.validator.js";
import * as AdminController from "./admin.controller.js";

const router = Router();

//TOPICS
router.post(
  "/topics",
  authenticate,
  requirePermission("topics:create"),
  validate(AdminValidator.createTopicValidation),
  AdminController.createTopic,
);

router.patch(
  "/topics/:id",
  authenticate,
  requirePermission("topics:update"),
  validate(AdminValidator.updateTopicValidation),
  AdminController.updateTopic,
);

router.delete(
  "/topics/:id",
  authenticate,
  requirePermission("topics:delete"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteTopic,
);

//SUBTOPICS

router.post(
  "/subtopics",
  authenticate,
  requirePermission("subtopics:create"),
  validate(AdminValidator.createSubTopicValidation),
  AdminController.createSubTopic,
);

router.patch(
  "/subtopics/:id",
  authenticate,
  requirePermission("subtopics:update"),
  validate(AdminValidator.updateSubTopicValidation),
  AdminController.updateSubTopic,
);

router.delete(
  "/subtopics/:id",
  authenticate,
  requirePermission("subtopics:delete"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteSubTopic,
);

//QUESTIONS

router.post(
  "/questions",
  authenticate,
  requirePermission("questions:create"),
  validate(AdminValidator.createQuestionValidation),
  AdminController.createQuestion,
);

router.patch(
  "/questions/:id",
  authenticate,
  requirePermission("questions:update"),
  validate(AdminValidator.updateQuestionValidation),
  AdminController.updateQuestion,
);

router.delete(
  "/questions/:id",
  authenticate,
  requirePermission("questions:delete"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteQuestion,
);

export default router;
