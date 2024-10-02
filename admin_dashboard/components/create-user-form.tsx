"use client";

import { z } from "zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
});

export default function CreateUserForm() {

  const lastNameRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Fisrt Name</FormLabel>
              <FormControl
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  if (value.endsWith(" ")) {
                    lastNameRef.current?.focus();
                  }
                  setFirstName(value);
                }}
              >
                <Input
                  placeholder="First Name"
                  autoComplete="false"
                  data-1p-ignore
                  data-bwignore
                  data-lpignore="true"
                  data-form-type="other"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                ref={lastNameRef}
                onChange={(e) =>
                  setLastName((e.target as HTMLInputElement).value)
                }
              >
                <Input
                  placeholder="Last Name"
                  autoComplete="false"
                  data-1p-ignore
                  data-bwignore
                  data-lpignore="true"
                  data-form-type="other"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant={"outline"} type="reset">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={"default"}
            type="submit"
            disabled={!firstName || !lastName}
          >
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
