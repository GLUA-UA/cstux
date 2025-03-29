import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import database from "@/lib/database";
import { SignInSchema } from "./definitions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = "admin";
      }
      return token;
    },
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
      async authorize(credentials) {
        // Validate the credentials
        const parsedCredentials = SignInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Find the admin user
        const adminUser = await database.adminUser.findUnique({
          where: { email },
        });

        if (!adminUser) {
          console.log("No user found with email:", email);
          return null;
        }

        // Verify password (assuming passwords are hashed with bcrypt)
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);

        if (!isPasswordValid) {
          console.log("Invalid password for user:", email);
          return null;
        }

        // Return the user object which will be saved in the JWT
        return {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
        };
      },
    }),
  ],
});

// Helper functions for auth operations
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
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