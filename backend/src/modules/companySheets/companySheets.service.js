import AppError from "../../utils/AppError.js";
import * as SheetRepository from "./companySheets.repository.js";

export const createSheetService = async (data) => {
  const {
    title,
    description,
    companyName,
    difficulty,
    estimatedTime,
    questionIds,
  } = data;

  if (!questionIds || questionIds.length === 0) {
    throw new AppError("Please provide at least one question.", 400);
  }

  const uniqueQuestionIds = [...new Set(questionIds)];

  if (uniqueQuestionIds.length !== questionIds.length) {
    throw new AppError("Duplicate question IDs are not allowed.", 400);
  }

  const questions = await SheetRepository.findQuestionsByIds(uniqueQuestionIds);

  if (questions.length !== uniqueQuestionIds.length) {
    throw new AppError("One or more questions do not exist.", 404);
  }

  return await SheetRepository.createSheet(
    {
      title,
      description,
      companyName,
      difficulty,
      estimatedTime,
    },
    uniqueQuestionIds,
  );
};

export const updateSheetService = async (sheetId, data) => {
  const existingSheet = await SheetRepository.findSheetById(sheetId);

  if (!existingSheet) {
    throw new AppError("Sheet not found.", 404);
  }

  if (data.questionIds) {
    const uniqueQuestionIds = [...new Set(data.questionIds)];

    if (uniqueQuestionIds.length !== data.questionIds.length) {
      throw new AppError("Duplicate question IDs are not allowed.", 400);
    }

    const questions =
      await SheetRepository.findQuestionsByIds(uniqueQuestionIds);

    if (questions.length !== uniqueQuestionIds.length) {
      throw new AppError("One or more questions do not exist.", 404);
    }

    data.questionIds = uniqueQuestionIds;
  }

  return await SheetRepository.updateSheet(sheetId, data);
};

export const deleteSheetService = async (sheetId) => {
  const existingSheet = await SheetRepository.findSheetById(sheetId);

  if (!existingSheet) {
    throw new AppError("Sheet not found.", 404);
  }

  await SheetRepository.deleteSheet(sheetId);
};
