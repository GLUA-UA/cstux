"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container m-auto">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-6 text-center">
        Torneio de SuperTux
      </h2>
      <div className="m-3">
      <h1 className="font-bold">Download do Cliente</h1>
        <Button className="mr-3" onClick={() => {
          window.location.href = "/api/download?platform=windows";
        }}>
          Transferir cliente para Windows
        </Button>
        <Button className="mx-3" onClick={() => {
          window.location.href = "/api/download?platform=linux";
        }}>
          Transferir cliente para Linux
        </Button>
      </div>
      <div className="m-3">
        <h1 className="font-bold">Links</h1>
        <Button onClick={() => { window.location.href = "/leaderboard"; }}>
          Ir para Leaderboard
        </Button>
      </div>
    </div>
  );
}
