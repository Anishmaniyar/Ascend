import { z } from "zod";

const sheetBodyShape = {
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, { error: "Title must be at least 3 characters" })
    .max(255, { error: "Title cannot exceed 255 characters" }),

  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(10, { error: "Description must be at least 10 characters" })
    .max(5000, { error: "Description cannot exceed 5000 characters" }),

  companyName: z
    .string({ error: "Company name is required" })
    .trim()
    .min(2, { error: "Company name must be at least 2 characters" })
    .max(255, { error: "Company name cannot exceed 255 characters" }),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    error: "Difficulty must be either EASY, MEDIUM, or HARD",
  }),

  estimatedTime: z
    .string({ error: "Estimated time is required" })
    .regex(/^\d+:[0-5][0-9]$/, {
      error: "Estimated time must use 'HH:MM' string format (e.g., '1:00', '0:45')",
    }),

  questionIds: z
    .array(z.uuid({ error: "Each questionId must be a valid UUID" }))
    .min(1, { error: "A sheet must contain at least one question" }),
};

export const createSheetValidator = z.object({
  body: z.object(sheetBodyShape),
});

export const updateSheetValidator = z.object({
  body: z.object(
    Object.fromEntries(
      Object.entries(sheetBodyShape).map(([key, schema]) => [
        key,
        schema.optional(),
      ]),
    ),
  ),
  params: z.object({
    id: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});

export const sheetIdParamValidator = z.object({
  params: z.object({
    id: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});
