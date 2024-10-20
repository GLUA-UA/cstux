"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import React, { useEffect, useState } from "react";

// // // // // // // // // // // // // // // // //
//             COLUMNS DEFINITION               //
// // // // // // // // // // // // // // // // //

export type Record = {
  fullName: string;
  attempts: number;
  lowestTime: number;
  percentage: number;
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
    accessorKey: "attempts",
    header: "Attempts on Boss Level",
    cell: ({ row }) => {
      const record = row.original;
      return record.attempts;
    },
  },
  {
    accessorKey: "lowestTime",
    header: "Lowest Time",
    cell: ({ row }) => {
      const record = row.original;
      return record.lowestTime;
    },
  },
  {
    accessorKey: "percentage",
    header: "Percentage of Lowest Time Attempts",
    cell: ({ row }) => {
      const record = row.original;
      return record.percentage + "%";
    },
  },
];

// // // // // // // // // // // // // // // //
//               TABLE COMPONENT             //
// // // // // // // // // // // // // // // //

export default function BossLeaderTable() {

  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leaderboard/boss", {
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
      } catch (error: unknown) {
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