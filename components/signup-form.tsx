"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { signUpAction } from "@/lib/authentication/actions";
import { SignUpSchema } from "@/lib/authentication/definitions";

export default function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    try {
      SignUpSchema.parse({
        name,
        email,
        password,
        confirmPassword,
        acceptTerms,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const result = await signUpAction(formData);

      if (result?.error) {
        toast("Account creation failed", {
          description: result.error,
        });
      } else {
        toast("Success!", {
          description: "Your admin account has been created.",
        });

        router.push("/auth/signin");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome, administrator!</CardTitle>
        <CardDescription>
          Create your new administrator account to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-5">
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="name"
                className={errors.name ? "text-destructive" : ""}
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="email"
                className={errors.email ? "text-destructive" : ""}
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="password"
                className={errors.password ? "text-destructive" : ""}
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className={errors.confirmPassword ? "text-destructive" : ""}
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(value) => setAcceptTerms(!!value)}
                className={errors.acceptTerms ? "border-destructive" : ""}
              />
              <Label
                htmlFor="terms"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  errors.acceptTerms ? "text-destructive" : ""
                }`}
              >
                I know that I cannot recover the password.
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive -mt-3">
                {errors.acceptTerms}
              </p>
            )}
          </div>
          <CardFooter className="flex justify-between px-0 pt-5">
            <Button variant="outline" disabled={true} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
