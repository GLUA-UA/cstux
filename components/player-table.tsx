"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAllPlayersAction } from "@/lib/players/actions";
import CreatePlayerDialog from "@/components/create-player-dialog";
import DeletePlayerDialog from "@/components/delete-player-dialog";

// Type definition for Player that matches your database schema
export type Player = {
  id: string;
  name: string;
  accessCode: string;
  createdAt: Date;
  updatedAt: Date;
  statuses: {
    id: string;
    status: string;
    createdAt: Date;
  }[];
};

// Column definitions
export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Player Name",
  },
  {
    accessorKey: "accessCode",
    header: "Access Code",
    cell: ({ row }) => {
      const player = row.original;
      return (
        player.accessCode.substring(0, 4) + "-" + player.accessCode.substring(4)
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.statuses?.[0]?.status || "LOGGED_OUT";

      // Add status styling based on value
      let statusClass = "px-2 py-1 rounded text-xs font-medium ";

      switch (status) {
        case "LOGGED_IN":
          statusClass += "bg-green-100 text-green-800";
          break;
        case "PLAYING":
          statusClass += "bg-blue-100 text-blue-800";
          break;
        case "COMPLETED":
          statusClass += "bg-purple-100 text-purple-800";
          break;
        case "IDLE":
          statusClass += "bg-yellow-100 text-yellow-800";
          break;
        default:
          statusClass += "bg-gray-100 text-gray-800";
      }

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const h = createdAt.getHours().toString().padStart(2, "0");
      const min = createdAt.getMinutes().toString().padStart(2, "0");
      const s = createdAt.getSeconds().toString().padStart(2, "0");
      return `${h}:${min}:${s}`;
    },
  },
  {
    id: "actions",
    header: () => <CreatePlayerDialog />,
    cell: ({ row }) => {
      const player = row.original;
      return (
        <DeletePlayerDialog playerId={player.id} playerName={player.name} />
      );
    },
  },
];

export default function PlayerTable() {
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlayers = async () => {
    try {
      const result = await getAllPlayersAction();

      if (result.error) {
        toast("Error", {
          description: result.error,
        });
        setData([]);
      } else if (result.players) {
        setData(result.players);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast("Error", {
        description: "Failed to fetch players",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();

    // Set up interval for periodic refresh
    const interval = setInterval(() => {
      fetchPlayers();
    }, 2000); // Refresh every 2 seconds, matching the original code

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(), // Commented out to match original code
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pt-2 pb-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
