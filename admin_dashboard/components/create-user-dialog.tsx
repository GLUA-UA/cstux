"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateUserForm from "@/components/create-user-form";
import CreateUserAccessCode from "@/components/create-user-access-code";

export default function CreateUserDialog() {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  function defineAccessCode(accessCode: string | null) {
    setAccessCode(accessCode);
  }

  const [isLoading, setIsLoading] = useState(false);
  function defineLoading(isLoading: boolean) {
    setIsLoading(isLoading);
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  function defineErrorMessage(errorMessage: string | null) {
    setErrorMessage(errorMessage);
  }

  const [playerName, setPlayerName] = useState<string | null>(null);
  function definePlayerName(playerName: string | null) {
    setPlayerName(playerName);
  }

  function resetState() {
    setAccessCode(null);
    setIsLoading(false);
    setErrorMessage(null);
    setPlayerName(null);
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" size="icon">
          <UserPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Player</DialogTitle>
          <DialogDescription>
            Add a new player to the torunament. A access code will then be
            generated for the player to access the tournament.
          </DialogDescription>
        </DialogHeader>
        {!accessCode && (
          <CreateUserForm
            setAccessCode={defineAccessCode}
            setIsLoading={defineLoading}
            setErrorMessage={defineErrorMessage}
            setPlayerName={definePlayerName}
          />
        )}
        {accessCode && (
          <CreateUserAccessCode
            accessCode={accessCode}
            isLoading={isLoading}
            errorMessage={errorMessage}
            playerName={playerName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
