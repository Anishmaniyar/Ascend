import { z } from "zod";

const idParam = z.object({
  id: z.uuid({ error: "Invalid ID format" }),
});

export const createTopicValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(10, { error: "Must be minimum of 10 characters" })
      .max(100, { error: "Must be maximum of 100 characters" }),
    description: z
      .string({ error: "Description is required" })
      .trim()
      .min(10, { error: "Must be minimum of 10 characters" })
      .max(1000, { error: "Must be maximum of 1000 characters" }),
  }),
});

export const updateTopicValidation = z.object({
  body: createTopicValidation.shape.body.partial(),
  params: idParam,
});

export const deleteIdParamValidation = z.object({
  params: idParam,
});

export const createSubTopicValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(10, { error: "Must be minimum of 10 characters" })
      .max(100, { error: "Must be maximum of 100 characters" }),
    description: z
      .string({ error: "Description is required" })
      .trim()
      .min(10, { error: "Must be minimum of 10 characters" })
      .max(1000, { error: "Must be maximum of 1000 characters" }),

    topicId: z.uuid({ error: "Invalid topic ID format" }),
  }),
});

export const updateSubTopicValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title must be a string" })
      .trim()
      .min(3, { error: "Title must be at least 3 characters" })
      .max(100, { error: "Title cannot exceed 100 characters" })
      .optional(),

    description: z
      .string({ error: "Description must be a string" })
      .trim()
      .min(10, { error: "Description must be at least 10 characters" })
      .max(1000, { error: "Description cannot exceed 1000 characters" })
      .optional(),

    topicId: z.uuid({ error: "Invalid topic ID format" }).optional(),
  }),
  params: idParam,
});

const optionSchema = z.object({
  text: z
    .string({ error: "Option text is required" })
    .min(1, { error: "Option text cannot be empty" }),
  isCorrect: z.boolean({ error: "isCorrect must be a true/false boolean" }),
});

export const createQuestionValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(5, { error: "Title must be at least 5 characters" })
      .max(1000, { error: "Title cannot exceed 1000 characters" }),

    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
      error: "Difficulty must be either EASY, MEDIUM, or HARD",
    }),

    type: z.enum(["MCQ", "NUMERIC"], {
      error: "Type must be either MCQ or NUMERIC",
    }),

    solution: z
      .string({ error: "Solution is required" })
      .trim()
      .min(5, { error: "Solution explanation must be at least 5 characters" }),

    subtopicId: z.uuid({ error: "Invalid subtopic ID format" }),

    options: z
      .array(optionSchema)
      .min(2, { error: "An exam question must have at least 2 options" }),
  }),
});

export const updateQuestionValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title must be a string" })
      .trim()
      .min(5, { error: "Title must be at least 5 characters" })
      .max(1000, { error: "Title cannot exceed 1000 characters" })
      .optional(),

    difficulty: z
      .enum(["EASY", "MEDIUM", "HARD"], {
        error: "Difficulty must be either EASY, MEDIUM, or HARD",
      })
      .optional(),

    type: z
      .enum(["MCQ", "NUMERIC"], {
        error: "Type must be either MCQ or NUMERIC",
      })
      .optional(),

    solution: z
      .string({ error: "Solution must be a string" })
      .trim()
      .min(5, { error: "Solution explanation must be at least 5 characters" })
      .optional(),

    subtopicId: z.uuid({ error: "Invalid subtopic ID format" }).optional(),

    options: z
      .array(optionSchema)
      .min(2, { error: "An exam question must have at least 2 options" })
      .optional(),
  }),
  params: idParam,
});
