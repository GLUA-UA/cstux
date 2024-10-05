"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import CreateUserDialog from "@/components/create-user-dialog";
import DeleteUserDialog from "@/components/delete-user-dialog";

function deletePlayer(id: string) {
  // Implement me
}

// // // // // // // // // // // // // // // // //
//             COLUMNS DEFINITION               //
// // // // // // // // // // // // // // // // //

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  accessCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "playerName",
    header: "Player Name",
    cell: ({ row }) => {
      const player = row.original;
      return `${player.firstName} ${player.lastName}`;
    },
  },
  {
    accessorKey: "accessCode",
    header: "Access Code",
    cell: ({ row }) => {
      const player = row.original;
      return player.accessCode.substring(0, 4) + "-" + player.accessCode.substring(4);
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const d = createdAt.getDay();
      const m = createdAt.getMonth();
      const y = createdAt.getFullYear();
      const h = createdAt.getHours();
      const min = createdAt.getMinutes();
      const s = createdAt.getSeconds();
     return `${m}/${d}/${y} ${h}:${min}:${s}`;
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
        return (
            <CreateUserDialog />
        );
    },
    cell: ({ row }) => {
      const player = row.original;
      return (
        <DeleteUserDialog playerId={player.id} playerName={player.firstName + " " + player.lastName} />
      );
    },
  },
];

// // // // // // // // // // // // // // // //
//               TABLE COMPONENT             //
// // // // // // // // // // // // // // // //

export default function PlayerTable() {

  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users", {
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
        setData(result);
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        setData([]);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}