import { z } from "zod";

import { PRACTICE_MODES } from "./constants.js";

export const validateStartPracticeSession = z.object({
  body: z.object({
    subtopicId: z
      .string("Subtopic Id is required")
      .uuid("Must be a valid UUID format"),

    mode: z.enum(PRACTICE_MODES, {
      error_map: (issue) => {
        if (issue.code === "invalid enum value") {
          return {
            message: `Invalid mode choice. Permitted values: ${PRACTICE_MODES.join(" | ")}`,
          };
        }
        return { message: "mode is a required parameter field" };
      },
    }),
  }),
});

export const validateSubmitAttempt = z.object({
  body: z.object({
    questionId: z
      .string("Question Id is required")
      .uuid("Must be a valid UUID format"),

    selectedOptionId: z
      .string("Selected Option Id is required")
      .uuid("Must be a valid UUID format"),
  }),

  params: z.object({
    sessionId: z
      .string("Session Id is required")
      .uuid("Must be a valid UUID format"),
  }),
});
