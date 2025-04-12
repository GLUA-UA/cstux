import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import database from "@/lib/database";
import { SignInSchema } from "./definitions";

// Authentication configuration constants
const AUTH_CONFIG = {
  PAGES: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  SESSION: {
    STRATEGY: "jwt" as const,
    MAX_AGE: 1 * 24 * 60 * 60, // 1 day
  },
  BCRYPT_ROUNDS: 12,
} as const;

/**
 * NextAuth configuration with custom JWT and session handling
 * - Uses credentials provider for email/password authentication
 * - Implements custom JWT and session callbacks
 * - Includes password hashing utility
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: AUTH_CONFIG.PAGES,
  session: {
    strategy: AUTH_CONFIG.SESSION.STRATEGY,
    maxAge: AUTH_CONFIG.SESSION.MAX_AGE,
  },
  callbacks: {
    /**
     * JWT callback to add user data to the token
     * @param token - The JWT token
     * @param user - The authenticated user
     * @returns The modified token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = "admin";
      }
      return token;
    },

    /**
     * Session callback to add token data to the session
     * @param session - The current session
     * @param token - The JWT token
     * @returns The modified session
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      /**
       * Authorizes user credentials against the database
       * @param credentials - User credentials (email and password)
       * @returns User object if authorized, null otherwise
       */
      async authorize(credentials) {
        const parsedCredentials = SignInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const adminUser = await database.adminUser.findUnique({
          where: { email },
        });

        if (!adminUser) {
          console.log("No user found with email:", email);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, adminUser.password);

        if (!isPasswordValid) {
          console.log("Invalid password for user:", email);
          return null;
        }

        return {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
        };
      },
    }),
  ],
});

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, AUTH_CONFIG.BCRYPT_ROUNDS);
}

// Types
export type { Session } from "next-auth";

// Extend next-auth types for better TypeScript support
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}