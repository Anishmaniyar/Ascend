import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be of minimum 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be atleast 6 character"),
  }),
});

export const loginSchema = z.object({
  bpdy: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be atleast 6 character"),
  }),
});
