"use client";

import StartTournamentDialog from "@/components/start-tournament-dialog";
import StopTournamentDialog from "@/components/stop-tournament-dialog";
import { useState, useEffect } from "react";

export default function TournamentState() {

  const [tournamentStarted, setTournamentStarted] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/state/tournamentStarted", {
          method: "GET",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setTournamentStarted(result.statValue === "true");
      } catch (error: unknown) {
        console.error(error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  });

  return (
    <div className="rounded-md border">
      <div className="p-2">
        <span className="font-bold text-black">Tournament Status: </span>
        <span className={"font-bold " + (tournamentStarted ? "text-green-500" : "text-red-500")}>
          {tournamentStarted ? "Started" : "Not Started"}
        </span>
      </div>
      <div className="p-2">
        {tournamentStarted ? (
          <StopTournamentDialog />
        ) : (
          <StartTournamentDialog />
        )}
      </div>
    </div>
  )
}
