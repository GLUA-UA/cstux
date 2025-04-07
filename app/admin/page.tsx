import React from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/authentication";
import { signOutAction } from "@/lib/authentication/actions";
import PlayerTable from "@/components/player-table";

export default async function Admin() {
  const session = await auth();

  return (
    <div className="flex flex-col gap 10 h-screen items-center justify-center">
      Hello, admin name: {session?.user?.name}!


      <PlayerTable />

      <Button
        variant="default"
        onClick={signOutAction}
      >
        Sign Out
      </Button>
    </div>
  );
}
