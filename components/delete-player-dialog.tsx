"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deletePlayerAction } from "@/lib/players/actions";

type DeletePlayerDialogProps = {
  playerId: string;
  playerName: string;
};

export default function DeletePlayerDialog({ playerId, playerName }: DeletePlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const result = await deletePlayerAction(playerId);

      if (result.error) {
        toast("Error", {
          description: result.error,
        });
      } else {
        toast("Success", {
          description: `Player ${playerName} has been deleted.`,
        });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      toast("Error", {
        description: "An unexpected error occurred while deleting the player.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Player</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete player <span className="font-medium text-foreground">{playerName}</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}