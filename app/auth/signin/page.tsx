import React from "react";
import { Metadata } from "next";
import SignInForm from "@/components/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
}