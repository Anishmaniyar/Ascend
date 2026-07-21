import { Difficulty } from "@prisma/client";
import { z } from "zod";

export const createTopicValidation = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Must be a string" })
      .min(10, "Must be minimum of 10 characters")
      .max(100, "Must be maximum of 100 characters"),
    description: z
      .string({ required_error: "Must be a string" })
      .min(10, "Must be minimum of 10 characters")
      .max(1000, "Must be maximum of 1000 characters"),
  }),
});

export const updateTopicValidation = z.object({
  body: createTopicValidation.shape.body.partial(),
});

export const createSubTopicValidation = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Must be a string" })
      .min(10, "Must be minimum of 10 characters")
      .max(100, "Must be maximum of 100 characters"),
    description: z
      .string({ required_error: "Must be a string" })
      .min(10, "Must be minimum of 10 characters")
      .max(1000, "Must be maximum of 1000 characters"),

    topicId: z.string().uuid("Invalid topic ID format"),
  }),
});

export const updateSubTopicValidation = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100)
        .optional(),

      description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000)
        .optional(),

      topicId: z.string().uuid("Invalid topic ID format").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "You must provide at least one field to update (title, description, or topicId)",
    }),
});

export const createQuestionValidation = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(1000),

    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
      errorMap: () => ({
        message: "Difficulty must be either EASY, MEDIUM, or HARD",
      }),
    }),

    type: z.enum(["MCQ", "NUMERIC"], {
      errorMap: () => ({ message: "Type must be either MCQ or NUMERIC" }),
    }),

    solution: z
      .string()
      .min(5, "Solution explanation must be at least 5 characters"),

    subtopicId: z.string().uuid("Invalid subtopic ID format"),

    options: z
      .array(
        z.object({
          text: z.string().min(1, "Option text cannot be empty"),
          isCorrect: z.boolean({
            required_error: "isCorrect must be a true/false boolean",
          }),
        }),
      )
      .min(2, "An exam question must have at least 2 options"), // Guarantees a choice array layout
  }),
});

export const updateQuestionValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(1000)
      .optional(),

    difficulty: z
      .enum(["EASY", "MEDIUM", "HARD"], {
        errorMap: () => ({
          message: "Difficulty must be either EASY, MEDIUM, or HARD",
        }),
      })
      .optional(),

    type: z
      .enum(["MCQ", "NUMERIC"], {
        errorMap: () => ({ message: "Type must be either MCQ or NUMERIC" }),
      })
      .optional(),

    solution: z
      .string()
      .min(5, "Solution explanation must be at least 5 characters")
      .optional(),

    subtopicId: z.string().uuid("Invalid subtopic ID format").optional(),

    options: z
      .array(
        z.object({
          text: z.string().min(1, "Option text cannot be empty"),
          isCorrect: z.boolean({
            required_error: "isCorrect must be a true/false boolean",
          }),
        }),
      )
      .min(2, "An exam question must have at least 2 options")
      .optional(),
  }),
});
