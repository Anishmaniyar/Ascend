import asyncHandler from "../../utils/asyncHandler.js";
import * as SheetService from "./companySheets.service.js";

export const createSheet = asyncHandler(async (req, res, next) => {
  const data = req.body;

  const response = await SheetService.createSheetService(data);

  return res.status(201).json({
    success: true,
    message: "Company sheet created successfully",
    data: response,
  });
});

export const updateSheet = asyncHandler(async (req, res, next) => {
  const sheetId = req.params.id;
  const data = req.body;

  const response = await SheetService.updateSheetService(sheetId, data);

  return res.status(200).json({
    success: true,
    message: "Sheet updated successfully",
    data: response,
  });
});

export const deleteSheet = asyncHandler(async (req, res, next) => {
  const sheetId = req.params.id;

  const response = await SheetService.deleteSheetService(sheetId);

  return res.status(200).json({
    success: true,
    message: "Sheet deleted successfully",
    data: response,
  });
});
