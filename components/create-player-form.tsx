"use client";

import { useState, useRef } from "react";
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
import { toast } from "sonner";
import { createPlayerAction } from "@/lib/players/actions";
import { cn } from "@/lib/utils";

// Define the form schema for validation
const PlayerSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(25, {
      message: "First name must be at most 25 characters.",
    })
    .trim(),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(25, {
      message: "Last name must be at most 25 characters.",
    })
    .trim(),
});

interface CreatePlayerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCard?: boolean;
  className?: string;
}

export default function CreatePlayerForm({
  onSuccess,
  onCancel,
  showCard = true,
  className = "w-[400px]",
}: CreatePlayerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const lastNameRef = useRef<HTMLInputElement>(null);
  const formId = "create-player-form";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setAccessCode(null);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    // Client-side validation
    try {
      PlayerSchema.parse({ firstName, lastName });
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const result = await createPlayerAction({
        firstName,
        lastName,
      });

      if (result.error) {
        toast("Error", {
          description: result.error,
        });
      } else if (result.accessCode) {
        setAccessCode(result.accessCode);
        toast("Success!", {
          description: "Player created successfully",
        });

        // Clear the form
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Player creation error:", error);
      toast("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(" ")) {
      e.target.value = value.trim();
      lastNameRef.current?.focus();
    }
  };

  const resetForm = () => {
    document
      .getElementById(formId)
      ?.dispatchEvent(new Event("reset", { cancelable: true, bubbles: true }));
    setErrors({});
    setAccessCode(null);
  };

  const renderFormContent = () => (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-5">
        {!accessCode ? (
          <>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="firstName"
                className={errors.firstName ? "text-destructive" : ""}
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                autoComplete="off"
                className={errors.firstName ? "border-destructive" : ""}
                onChange={handleFirstNameChange}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="lastName"
                className={errors.lastName ? "text-destructive" : ""}
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                autoComplete="off"
                className={errors.lastName ? "border-destructive" : ""}
                ref={lastNameRef}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 bg-primary/10 border rounded-md">
            <p className="font-medium text-sm mb-1">Access Code:</p>
            <p className="text-lg font-bold tracking-wider">
              {accessCode.substring(0, 4)}-{accessCode.substring(4)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with the player to allow them to join the
              tournament.
            </p>
          </div>
        )}
      </div>
    </form>
  );

  const renderFormActions = () => (
    <div className={cn("flex w-full mt-4", {
      "justify-between": accessCode && onCancel,
      "justify-end": !(accessCode && onCancel)
    })}>
      {accessCode && (
        <Button
          type="button"
          variant={onCancel ? "outline" : "default"}
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Create More
        </Button>
      )}
      {!accessCode && (
        <Button type="submit" form={formId} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Player"
          )}
        </Button>
      )}
      {accessCode && onCancel && (
        <Button
          type="button"
          variant="default"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Close
        </Button>
      )}
    </div>
  );

  if (!showCard) {
    return (
      <div className={className}>
        {renderFormContent()}
        {renderFormActions()}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Player</CardTitle>
        <CardDescription>
          Add a new player to the tournament. They'll receive an access code to
          join.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderFormContent()}</CardContent>
      <CardFooter>{renderFormActions()}</CardFooter>
    </Card>
  );
}