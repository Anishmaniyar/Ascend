import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .trim()
      .min(3, { error: "Name must be of minimum 3 characters" })
      .max(255, { error: "Name is too long" }),
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password must be atleast 6 character" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email format" }),
    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password must be atleast 6 character" }),
  }),
});
