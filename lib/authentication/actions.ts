"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signIn, signOut, hashPassword } from "@/lib/authentication";
import { SignInSchema, SignUpSchema } from "@/lib/authentication/definitions";
import database from "@/lib/database";

// Error messages for authentication actions
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_FORMAT: "Invalid email or password format",
  EMAIL_IN_USE: "Email already in use. Please use another email address.",
  INVALID_FORM_DATA: "Invalid form data. Please check all fields and try again.",
  SIGNUP_FAILED: "Failed to create account. Please try again later.",
} as const;

/**
 * Handles user sign-in action
 * @param formData - Form data containing email and password
 * @returns Promise<{ success: true } | { error: string }> - Result of the sign-in attempt
 */
export async function signInAction(formData: FormData) {
  try {
    // Extract and validate inputs
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      SignInSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: ERROR_MESSAGES.INVALID_FORMAT };
      }
    }

    // Check if user exists before attempting sign-in
    const userExists = await database.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!userExists) {
      return { error: ERROR_MESSAGES.INVALID_CREDENTIALS };
    }

    // Attempt to sign in
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { error: ERROR_MESSAGES.INVALID_CREDENTIALS };
  }
}

/**
 * Handles user sign-up action
 * @param formData - Form data containing user registration details
 * @returns Promise<{ success: true } | { error: string }> - Result of the sign-up attempt
 */
export async function signUpAction(formData: FormData) {
  try {
    // Extract inputs
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const acceptTerms = formData.get("acceptTerms") === "on";

    // Validate inputs
    try {
      SignUpSchema.parse({
        name,
        email,
        password,
        confirmPassword,
        acceptTerms: true,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: ERROR_MESSAGES.INVALID_FORM_DATA };
      }
    }

    // Check if email already exists
    const existingUser = await database.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: ERROR_MESSAGES.EMAIL_IN_USE };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new admin user
    await database.adminUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: ERROR_MESSAGES.SIGNUP_FAILED };
  }
}

/**
 * Handles user sign-out action
 * Redirects to the sign-in page after signing out
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/auth/signin" });
}