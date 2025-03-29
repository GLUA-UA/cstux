import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .trim()
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(25, { message: "Name must be at most 25 characters long" })
    .trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.".trim(),
    }),
  confirmPassword: z
    .string()
    .trim(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
