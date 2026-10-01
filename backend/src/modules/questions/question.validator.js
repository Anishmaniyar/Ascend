import { z } from "zod";

export const questionsQuerySchema = z.object({
  query: z.object({
    subtopicId: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});

export const questionIdParamSchema = z.object({
  params: z.object({
    questionId: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});
