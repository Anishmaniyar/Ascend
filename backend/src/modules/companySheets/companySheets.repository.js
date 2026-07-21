import prisma from "../../db.js";

export const findQuestionsByIds = async (questionIds) => {
  return await prisma.question.findMany({
    where: {
      id: {
        in: questionIds,
      },
    },
    select: {
      id: true,
    },
  });
};

export const createSheet = async (sheetData, questionIds) => {
  return await prisma.$transaction(async (tx) => {
    const sheet = await tx.sheet.create({
      data: sheetData,
    });

    await tx.sheetQuestion.createMany({
      data: questionIds.map((questionId) => ({
        sheetId: sheet.id,
        questionId,
      })),
    });

    return await tx.sheet.findUnique({
      where: {
        id: sheet.id,
      },
      include: {
        sheetQuestions: {
          include: {
            question: true,
          },
        },
      },
    });
  });
};

export const findSheetById = async (sheetId) => {
  return await prisma.sheet.findUnique({
    where: {
      id: sheetId,
    },
  });
};

export const updateSheet = async (sheetId, data) => {
  const {
    questionIds,
    title,
    description,
    companyName,
    difficulty,
    estimatedTime,
  } = data;

  return await prisma.$transaction(async (tx) => {
    await tx.sheet.update({
      where: {
        id: sheetId,
      },
      data: {
        title,
        description,
        companyName,
        difficulty,
        estimatedTime,
      },
    });

    if (questionIds) {
      await tx.sheetQuestion.deleteMany({
        where: {
          sheetId,
        },
      });

      await tx.sheetQuestion.createMany({
        data: questionIds.map((questionId) => ({
          sheetId,
          questionId,
        })),
      });
    }

    return await tx.sheet.findUnique({
      where: {
        id: sheetId,
      },
      include: {
        sheetQuestions: {
          include: {
            question: true,
          },
        },
      },
    });
  });
};

export const deleteSheet = async (sheetId) => {
  return await prisma.sheet.delete({
    where: {
      id: sheetId,
    },
  });
};
