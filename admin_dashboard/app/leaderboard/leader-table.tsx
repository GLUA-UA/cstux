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

// // // // // // // // // // // // // // // // //
//             COLUMNS DEFINITION               //
// // // // // // // // // // // // // // // // //

export type Record = {
  fullName: string;
  lastCompletedLevel: string;
  levelsCompleted: number;
  totalTime: number;
  totalCoins: number;
  totalBadguysKilled: number;
  totalSecrets: number;
  timeBonus: number;
  timeWithBonus: number;
};

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: "fullName",
    header: "Player Name",
    cell: ({ row }) => {
      const record = row.original;
      return `${record.fullName}`;
    },
  },
  {
    accessorKey: "lastCompletedLevel",
    header: "Last Completed Level",
    cell: ({ row }) => {
      const record = row.original;
      return record.lastCompletedLevel;
    },
  },
  {
    accessorKey: "levelsCompleted",
    header: "Progress",
    cell: ({ row }) => {
      const record = row.original;
      return `${record.levelsCompleted} / 23`;
    },
  },
  {
    accessorKey: "totalTime",
    header: "Total Time",
    cell: ({ row }) => {
      const record = row.original;
      return record.totalTime;
    },
  },
  {
    accessorKey: "totalCoins",
    header: "Coins",
    cell: ({ row }) => {
      const record = row.original;
      return record.totalCoins;
    },
  },
  {
    accessorKey: "totalBadguysKilled",
    header: "Bad Guys Killed",
    cell: ({ row }) => {
      const record = row.original;
      return record.totalBadguysKilled;
    },
  },
  {
    accessorKey: "totalSecrets",
    header: "Secrets",
    cell: ({ row }) => {
      const record = row.original;
      return record.totalSecrets;
    },
  },
  {
    accessorKey: "timeBonus",
    header: "Time Bonus",
    cell: ({ row }) => {
      const record = row.original;
      return record.timeBonus;
    },
  },
  {
    accessorKey: "timeWithBonus",
    header: "Time with Bonus",
    cell: ({ row }) => {
      const record = row.original;
      return record.timeWithBonus;
    },
  },
];

// // // // // // // // // // // // // // // //
//               TABLE COMPONENT             //
// // // // // // // // // // // // // // // //

export default function LeaderTable() {

  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leaderboard", {
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
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
                    <TableCell key={cell.id} className="pt-2 pb-2" >
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