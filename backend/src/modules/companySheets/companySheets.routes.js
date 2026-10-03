import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as SheetsController from "./companySheets.controller.js";
import * as SheetValidator from "./companySheets.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("sheets:create"),
  validate(SheetValidator.createSheetValidator),
  SheetsController.createSheet,
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("sheets:update"),
  validate(SheetValidator.updateSheetValidator),
  SheetsController.updateSheet,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("sheets:delete"),
  validate(SheetValidator.sheetIdParamValidator),
  SheetsController.deleteSheet,
);

export default router;
