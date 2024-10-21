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
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DeleteUserDialog({ playerId, playerName} : { playerId: string, playerName: string }) {

  const [open, setOpen] = useState(false);

  async function onSubmit({ playerId }: { playerId: string }) {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: playerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      console.log("User deleted");
      setOpen(false);
    } catch (error: any) {
      console.log(error.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Player</DialogTitle>
          <DialogDescription>
            Deleting a player will remove all their data from the tournament is
            permanent.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <p className="text-md text-gray-500 text-center">
            You will be deleting the following player:
          </p>
          <p className="text-4xl font-semibold text-center pt-2">
            {playerName}
          </p>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant={"outline"} type="reset">
              Cancel
            </Button>
          </DialogClose>
          <Button variant={"destructive"} type="submit" onClick={() => onSubmit({ playerId })}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
