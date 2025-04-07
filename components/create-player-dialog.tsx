"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePlayerForm from "@/components/create-player-form";

export default function CreatePlayerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Player</DialogTitle>
          <DialogDescription>
            Add a new player to the tournament. They'll receive an access code to join.
          </DialogDescription>
        </DialogHeader>
        <CreatePlayerForm
          showCard={false}
          onCancel={() => setOpen(false)}
          className="w-full"
        />
      </DialogContent>
    </Dialog>
  );
}