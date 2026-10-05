import { z } from "zod";

export const leaderboardQuerySchema = z.object({
  query: z.object({
    period: z
      .enum(["weekly", "monthly", "alltime"], {
        error: "Period must be weekly, monthly or alltime",
      })
      .optional()
      .default("alltime"),
    sort: z
      .enum(["score", "questions", "accuracy", "streak"], {
        error: "Sort must be score, questions, accuracy or streak",
      })
      .optional()
      .default("score"),
  }),
});
