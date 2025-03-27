import React from "react";
import { Metadata } from "next";
import SignUpForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Create Admin Account",
};
export default function SignUp() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUpForm />
    </div>
  );
}

