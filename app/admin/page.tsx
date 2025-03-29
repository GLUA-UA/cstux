import React from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/authentication";
import { signOutAction } from "@/lib/authentication/actions";

export default async function Admin() {
  const session = await auth();

  return (
    <div className="flex h-screen items-center justify-center">
      Hello, admin name: {session?.user?.name}!

      <Button
        variant="default"
        onClick={signOutAction}
      >
        Sign Out
      </Button>
    </div>
  );
}
