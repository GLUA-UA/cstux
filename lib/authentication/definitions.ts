import { z } from "zod";

// Validation constants
const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 25,
  },
  PASSWORD: {
    MIN_LENGTH: 10,
  },
} as const;

// Error messages for validation
const ERROR_MESSAGES = {
  NAME: {
    TOO_SHORT: "Name must be at least 2 characters long",
    TOO_LONG: "Name must be at most 25 characters long",
  },
  EMAIL: {
    INVALID: "Invalid email address",
  },
  PASSWORD: {
    TOO_SHORT: "Password must be at least 10 characters long",
    NO_LETTER: "Contain at least one letter.",
    NO_NUMBER: "Contain at least one number.",
    NO_SPECIAL: "Contain at least one special character.",
    NO_MATCH: "Passwords don't match",
  },
  TERMS: {
    NOT_ACCEPTED: "You must accept this",
  },
} as const;

/**
 * Schema for user sign-in validation
 * Validates email and password format
 */
export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: ERROR_MESSAGES.EMAIL.INVALID })
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, { 
      message: ERROR_MESSAGES.PASSWORD.TOO_SHORT 
    })
    .trim()
});

/**
 * Schema for user sign-up validation
 * Validates name, email, password, and terms acceptance
 * Ensures password and confirmPassword match
 */
export const SignUpSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME.MIN_LENGTH, { 
      message: ERROR_MESSAGES.NAME.TOO_SHORT 
    })
    .max(VALIDATION.NAME.MAX_LENGTH, { 
      message: ERROR_MESSAGES.NAME.TOO_LONG 
    })
    .trim(),
  email: z
    .string()
    .email({ message: ERROR_MESSAGES.EMAIL.INVALID })
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, { 
      message: ERROR_MESSAGES.PASSWORD.TOO_SHORT 
    })
    .regex(/[a-zA-Z]/, { 
      message: ERROR_MESSAGES.PASSWORD.NO_LETTER 
    })
    .regex(/[0-9]/, { 
      message: ERROR_MESSAGES.PASSWORD.NO_NUMBER 
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: ERROR_MESSAGES.PASSWORD.NO_SPECIAL,
    }),
  confirmPassword: z.string().trim(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: ERROR_MESSAGES.TERMS.NOT_ACCEPTED,
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.PASSWORD.NO_MATCH,
  path: ["confirmPassword"],
});
