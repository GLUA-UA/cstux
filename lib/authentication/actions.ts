"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signIn, signOut, hashPassword } from "@/lib/authentication";
import { SignInSchema, SignUpSchema } from "@/lib/authentication/definitions";
import database from "@/lib/database";

export async function signInAction(formData: FormData) {
  try {
    // Extract and validate inputs
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      SignInSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          error: "Invalid email or password format",
        };
      }
    }

    // Check if user exists before attempting sign-in
    const userExists = await database.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!userExists) {
      return {
        error: "Invalid email or password",
      };
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
    return {
      error: "Invalid email or password",
    };
  }
}

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
        return {
          error: "Invalid form data. Please check all fields and try again.",
        };
      }
    }

    // Check if email already exists
    const existingUser = await database.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        error: "Email already in use. Please use another email address.",
      };
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
    return {
      error: "Failed to create account. Please try again later.",
    };
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/auth/signin" });
}