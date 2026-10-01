import { Router } from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as AdminValidator from "./admin.validator.js";
import * as AdminController from "./admin.controller.js";

const router = Router();

//TOPICS
router.post(
  "/topics",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.createTopicValidation),
  AdminController.createTopic,
);

router.patch(
  "/topics/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.updateTopicValidation),
  AdminController.updateTopic,
);

router.delete(
  "/topics/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteTopic,
);

//SUBTOPICS

router.post(
  "/subtopics",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.createSubTopicValidation),
  AdminController.createSubTopic,
);

router.patch(
  "/subtopics/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.updateSubTopicValidation),
  AdminController.updateSubTopic,
);

router.delete(
  "/subtopics/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteSubTopic,
);

//QUESTIONS

router.post(
  "/questions",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.createQuestionValidation),
  AdminController.createQuestion,
);

router.patch(
  "/questions/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.updateQuestionValidation),
  AdminController.updateQuestion,
);

router.delete(
  "/questions/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.deleteIdParamValidation),
  AdminController.deleteQuestion,
);

export default router;
