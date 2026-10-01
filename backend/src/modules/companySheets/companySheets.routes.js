import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as SheetsController from "./companySheets.controller.js";
import * as SheetValidator from "./companySheets.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(SheetValidator.createSheetValidator),
  SheetsController.createSheet,
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(SheetValidator.updateSheetValidator),
  SheetsController.updateSheet,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(SheetValidator.sheetIdParamValidator),
  SheetsController.deleteSheet,
);

export default router;
