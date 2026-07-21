import { z } from "zod";

export const createSheetValidator = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title cannot exceed 255 characters"),

    description: z
      .string({ required_error: "Description is required" })
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description cannot exceed 5000 characters"),

    companyName: z
      .string({ required_error: "Company name is required" })
      .min(2, "Company name must be at least 2 characters")
      .max(255, "Company name cannot exceed 255 characters"),

    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
      errorMap: () => ({
        message: "Difficulty must be either EASY, MEDIUM, or HARD",
      }),
    }),

    estimatedTime: z
      .string({ required_error: "Estimated time is required" })
      .regex(
        /^\d+:[0-5][0-9]$/,
        "Estimated time must use 'HH:MM' string format (e.g., '1:00', '0:45')",
      ),

    sheetQuestions: z
      .array(
        z.object({
          questionId: z.string().uuid("Each questionId must be a valid UUID"),
        }),
      )
      .min(1, "A sheet must contain at least one question"),
  }),
});
