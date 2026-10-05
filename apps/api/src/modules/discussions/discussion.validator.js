import { z } from "zod";

export const createDiscussionValidation = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(5, { error: "Title must be at least 5 characters" })
      .max(255, { error: "Title cannot exceed 255 characters" }),
    content: z
      .string({ error: "Content is required" })
      .trim()
      .min(10, { error: "Content must be at least 10 characters" })
      .max(5000, { error: "Content cannot exceed 5000 characters" }),
    tag: z
      .string({ error: "Tag must be a string" })
      .trim()
      .max(50, { error: "Tag cannot exceed 50 characters" })
      .optional(),
  }),
});
