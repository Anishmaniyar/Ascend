import { z } from "zod";

const idParam = z.object({
  id: z.uuid({ error: "Invalid ID format" }),
});

const contestBody = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(5, { error: "Title must be at least 5 characters" })
    .max(255, { error: "Title cannot exceed 255 characters" }),
  description: z
    .string({ error: "Description must be a string" })
    .trim()
    .max(2000, { error: "Description cannot exceed 2000 characters" })
    .optional(),
  type: z
    .enum(["WEEKLY", "COMPANY"], { error: "Type must be WEEKLY or COMPANY" })
    .optional()
    .default("WEEKLY"),
  company: z
    .string({ error: "Company must be a string" })
    .trim()
    .max(255, { error: "Company cannot exceed 255 characters" })
    .optional(),
  difficulty: z
    .enum(["EASY", "MEDIUM", "HARD"], {
      error: "Difficulty must be EASY, MEDIUM or HARD",
    })
    .optional()
    .default("MEDIUM"),
  startsAt: z.coerce.date({ error: "Start time must be a valid date" }),
  endsAt: z.coerce.date({ error: "End time must be a valid date" }),
  durationMin: z
    .number({ error: "Duration must be a number" })
    .int({ error: "Duration must be a whole number of minutes" })
    .min(5, { error: "Duration must be at least 5 minutes" })
    .max(1440, { error: "Duration cannot exceed 1440 minutes" })
    .optional()
    .default(60),
  totalQuestions: z
    .number({ error: "Question count must be a number" })
    .int({ error: "Question count must be a whole number" })
    .min(0, { error: "Question count cannot be negative" })
    .max(1000, { error: "Question count cannot exceed 1000" })
    .optional()
    .default(0),
});

export const createContestValidation = z.object({
  body: contestBody.refine((b) => b.endsAt > b.startsAt, {
    error: "End time must be after start time",
  }),
});

export const updateContestValidation = z.object({
  body: contestBody.partial(),
  params: idParam,
});

export const contestIdParamValidation = z.object({
  params: idParam,
});
