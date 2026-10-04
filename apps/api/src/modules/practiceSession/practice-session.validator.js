import { z } from "zod";

import { PRACTICE_MODES } from "./constants.js";

export const validateStartPracticeSession = z.object({
  body: z.object({
    subtopicId: z.uuid({ error: "Must be a valid UUID format" }),

    mode: z.enum(PRACTICE_MODES, {
      error: `Invalid mode choice. Permitted values: ${PRACTICE_MODES.join(" | ")}`,
    }),
  }),
});

export const validateSubmitAttempt = z.object({
  body: z.object({
    questionId: z.uuid({ error: "Must be a valid UUID format" }),

    selectedOptionId: z.uuid({ error: "Must be a valid UUID format" }),
  }),

  params: z.object({
    id: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});

export const validateSessionIdParam = z.object({
  params: z.object({
    id: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});
