import AppError from "../../utils/AppError.js";
import * as AdminRepository from "./admin.repository.js";

export const createTopicService = async (title, description) => {
  const findTopicByTitle = await AdminRepository.findTopicByTitle(title);

  if (findTopicByTitle) {
    throw new AppError("Title already exists", 409);
  }

  const createTopic = await AdminRepository.createTopic(title, description);

  return createTopic;
};

export const updateTopicService = async (id, updatedData) => {
  const existingTopic = await AdminRepository.findTopicById(id);

  if (!existingTopic) {
    throw new AppError("Topic not found", 404);
  }

  if (updatedData.title) {
    const duplicateTitle = await AdminRepository.findTopicByTitle(
      updatedData.title,
    );

    if (duplicateTitle && duplicateTitle.id !== id) {
      throw new AppError("A topic with this title already exists", 409);
    }
  }

  const updatedTopic = await AdminRepository.updatedTopic(id, updatedData);

  return updatedTopic;
};

export const deleteTopicService = async (id) => {
  const topicExists = await AdminRepository.findTopicById(id);

  if (!topicExists) {
    throw new AppError("Topic not found", 404);
  }

  const deleteTopic = await AdminRepository.deleteTopicById(id);

  return deleteTopic;
};

export const createSubTopicService = async (title, description, topicId) => {
  const findTopicExist = await AdminRepository.findTopicById(topicId);

  if (!findTopicExist) {
    throw new AppError("Topic not found", 404);
  }

  const findSubTopic = await AdminRepository.findSubTopicByTitleAndTopic(
    title,
    topicId,
  );

  if (findSubTopic) {
    throw new AppError("SubTopic with the same name already exists", 400);
  }

  const createSubtopic = await AdminRepository.createSubTopic(
    title,
    description,
    topicId,
  );

  return createSubtopic;
};

export const updateSubTopicService = async (id, updatedData) => {
  const existingSubTopic = await AdminRepository.findSubTopicById(id);
  if (!existingSubTopic) {
    throw new AppError("Subtopic not found", 404);
  }

  const targetTopicId = updatedData.topicId || existingSubTopic.topicId;

  if (updatedData.topicId) {
    const findTopicExists = await AdminRepository.findTopicById(
      updatedData.topicId,
    );
    if (!findTopicExists) {
      throw new AppError("Target parent topic does not exist", 404);
    }
  }

  if (updatedData.title || updatedData.topicId) {
    const activeTitle = updatedData.title || existingSubTopic.title;

    const duplicateCheck = await AdminRepository.findSubTopicByTitleAndTopic(
      activeTitle,
      targetTopicId,
    );

    if (duplicateCheck && duplicateCheck.id !== id) {
      throw new AppError(
        "A subtopic with this title already exists under this topic",
        409,
      );
    }
  }

  const updatedResult = await AdminRepository.updateSubTopic(id, updatedData);
  return updatedResult;
};

export const deleteSubTopicService = async (id) => {
  const subtopicExists = await AdminRepository.findSubTopicById(id);

  if (!subtopicExiststopicExists) {
    throw new AppError("Sub Topic not found", 404);
  }

  const deleteSubTopic = await AdminRepository.deleteSubTopicById(id);

  return deleteTopic;
};

export const createQuestionService = async (
  title,
  difficulty,
  type,
  solution,
  subtopicId,
  options,
) => {
  const subTopicExist = await AdminRepository.findSubTopicById(subtopicId);

  if (!subTopicExist) {
    throw new AppError("Sub topic not found", 404);
  }

  const correctOptionsCount = options.filter(
    (option) => option.isCorrect === true,
  ).length;

  if (correctOptionsCount === 0) {
    throw new AppError(
      "You must mark exactly one option as correct. None were selected.",
      400,
    );
  }

  if (correctOptionsCount > 1) {
    throw new AppError(
      "A question cannot have multiple correct answers. Please select only one.",
      400,
    );
  }

  const createQuestion = await AdminRepository.createQuestion(
    title,
    difficulty,
    type,
    solution,
    subtopicId,
    options,
  );

  return createQuestion;
};

export const updateQuestionService = async (id, updatedData) => {
  const existingQuestion =
    await AdminRepository.findQuestionWithOptions(questionId);
  if (!existingQuestion) {
    throw new AppError("Question not found", 404);
  }

  if (updateData.options) {
    const existingOptionIds = existingQuestion.options.map((opt) => opt.id);

    for (const incomingOption of updateData.options) {
      if (incomingOption.id && !existingOptionIds.includes(incomingOption.id)) {
        throw new AppError(
          `Option ID ${incomingOption.id} does not belong to this question`,
          400,
        );
      }
    }

    const simulatedFinalOptions = [...existingQuestion.options];

    updateData.options.forEach((incomingOpt) => {
      if (incomingOpt.id) {
        const targetIndex = simulatedFinalOptions.findIndex(
          (o) => o.id === incomingOpt.id,
        );
        simulatedFinalOptions[targetIndex] = {
          ...simulatedFinalOptions[targetIndex],
          ...incomingOpt,
        };
      } else {
        simulatedFinalOptions.push(incomingOpt);
      }
    });

    const correctCount = simulatedFinalOptions.filter(
      (opt) => opt.isCorrect === true,
    ).length;
    if (correctCount === 0) {
      throw new AppError(
        "Validation failed: At least one option must be marked correct.",
        400,
      );
    }
    if (correctCount > 1) {
      throw new AppError(
        "Validation failed: A question cannot have multiple correct answers.",
        400,
      );
    }
  }

  const updatedQuestion = await AdminRepository.updateQuestion(
    questionId,
    updateData,
  );
  return updatedQuestion;
};

export const deleteQuestionService = async (id) => {
  // 1. Verify that the question exists first
  const questionExists = await AdminRepository.findQuestionById(id);

  if (!questionExists) {
    throw new AppError("Question not found", 404);
  }

  // 2. Perform the database deletion
  const deletedQuestion = await AdminRepository.deleteQuestionById(id);
  return deletedQuestion;
};
