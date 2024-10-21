"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function StartTournamentDialog() {

  const [open, setOpen] = useState(false);

  async function onSubmit() {
    try {
      const response = await fetch("/api/state/tournamentStarted", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: "true",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start tournament");
      }

      console.log("Tournament started");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message)
      else console.log("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="default">
          Start Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Tournament</DialogTitle>
          <DialogDescription>
            Starting the tournament will close all player&apos;s games
            and open them in competition mode.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant={"outline"} type="reset">
              Cancel
            </Button>
          </DialogClose>
          <Button variant={"default"} type="submit" onClick={() => onSubmit()}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
