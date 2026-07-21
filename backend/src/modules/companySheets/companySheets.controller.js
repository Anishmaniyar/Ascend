import asyncHandler from "../../utils/asyncHandler.js";
import * as SheetService from "./companySheets.service.js";

export const createSheet = asyncHandler(async (req, res, next) => {
  const data = req.body;

  const response = await SheetService.createSheetService(data);

  return res.status(201).json({
    status: "success",
    message: "Company sheet created successfully",
    data: response,
  });
});

export const updateSheet = asyncHandler(async (req, res, next) => {
  const sheet = await SheetService.updateSheetService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Sheet updated successfully.",
    data: sheet,
  });
});

export const deleteSheet = asyncHandler(async (req, res) => {
  await SheetService.deleteSheetService(req.params.sheetId);

  res.status(200).json({
    success: true,
    message: "Sheet deleted successfully.",
  });
});
