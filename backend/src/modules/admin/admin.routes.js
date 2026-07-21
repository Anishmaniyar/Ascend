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
  "/topic/:id",
  authenticate,
  authorize("ADMIN"),
  AdminController.deleteTopic,
);

//SUBTOPIC

router.post(
  "/subtopic",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.createSubTopicValidation),
  AdminController.createSubTopic,
);

router.patch(
  "/subtopic/:id",
  authenticate,
  authorize("ADMIN"),
  validate(AdminValidator.createSubTopicValidation),
  AdminController.updateSubTopic,
);

router.delete(
  "/subtopic/:id",
  authenticate,
  authorize("ADMIN"),
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
  "/question/:id",
  authenticate,
  authorize("ADMIN"),
  AdminController.deleteQuestion,
);

export default router;
