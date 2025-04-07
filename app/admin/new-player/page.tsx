import React from "react";

import PlayerTable from "@/components/player-table";
import CreatePlayerForm from "@/components/create-player-form";

export default async function Admin() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <CreatePlayerForm />
    </div>
  );
}
