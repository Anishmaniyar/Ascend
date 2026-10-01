import { z } from "zod";

export const topicIdParamSchema = z.object({
  params: z.object({
    id: z.uuid({ error: "Must be a valid UUID format" }),
  }),
});
