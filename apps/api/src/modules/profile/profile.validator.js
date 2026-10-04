import { z } from "zod";

// PATCH /profile — only Profile columns (Phase 11). userId / email / role
// are not accepted here: zod strips unknown keys, and the service allowlists
// again, so account fields can never be changed through this endpoint.

const nullableShortText = (max, error) =>
  z
    .string({ error })
    .trim()
    .max(max, { error })
    .nullable()
    .optional();

const nullableUrl = (error) =>
  z
    .url({ error })
    .trim()
    .max(2000, { error: "URL is too long" })
    .nullable()
    .optional();

export const updateProfileValidation = z.object({
  body: z.object({
    displayName: z
      .string({ error: "Display name must be a string" })
      .trim()
      .min(1, { error: "Display name cannot be empty" })
      .max(100, { error: "Display name cannot exceed 100 characters" })
      .optional(),

    handle: z
      .string({ error: "Handle must be a string" })
      .trim()
      .min(1, { error: "Handle cannot be empty" })
      .max(50, { error: "Handle cannot exceed 50 characters" })
      .nullable()
      .optional(),

    bio: z
      .string({ error: "Bio must be a string" })
      .trim()
      .max(500, { error: "Bio cannot exceed 500 characters" })
      .nullable()
      .optional(),

    gender: z
      .enum(["Male", "Female", "Non-binary", "Prefer not to say"], {
        error: "Gender must be a valid option",
      })
      .nullable()
      .optional(),

    dateOfBirth: z.coerce
      .date({ error: "Date of birth must be a valid date" })
      .nullable()
      .optional(),

    location: nullableShortText(120, "Location must be a string"),

    avatarUrl: nullableUrl("Avatar must be a valid URL"),
    githubUrl: nullableUrl("GitHub URL must be a valid URL"),
    linkedinUrl: nullableUrl("LinkedIn URL must be a valid URL"),
    leetcodeUrl: nullableUrl("LeetCode URL must be a valid URL"),
    xUrl: nullableUrl("X URL must be a valid URL"),
    websiteUrl: nullableUrl("Website URL must be a valid URL"),

    targetCompanies: z
      .array(
        z
          .string({ error: "Company names must be strings" })
          .trim()
          .min(1, { error: "Company names cannot be empty" })
          .max(100, { error: "Company names cannot exceed 100 characters" }),
      )
      .max(20, { error: "Too many target companies (max 20)" })
      .optional(),

    dailyQuestionGoal: z
      .number({ error: "Daily goal must be a number" })
      .int({ error: "Daily goal must be a whole number" })
      .min(1, { error: "Daily goal must be at least 1" })
      .max(500, { error: "Daily goal cannot exceed 500" })
      .nullable()
      .optional(),
  }),
});
