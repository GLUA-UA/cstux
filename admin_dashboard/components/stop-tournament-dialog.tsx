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

export default function StopTournamentDialog() {

  const [open, setOpen] = useState(false);

  async function onSubmit() {
    try {
      const response = await fetch("/api/state/tournamentStarted", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to stop tournament");
      }

      console.log("Tournament stopped");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message)
      else console.log("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="default">
          Stop Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stop Tournament</DialogTitle>
          <DialogDescription>
            Stopping the tournament will prevent any new levels from being submitted.
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant={"outline"} type="reset">
              Cancel
            </Button>
          </DialogClose>
          <Button variant={"destructive"} type="submit" onClick={() => onSubmit()}>
            Stop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
