"use client";

import * as React from "react";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table-pagination";
import DataTableToggleColumn from "@/components/data-table-toggle-column";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrentUserRoleType } from "@/config/user";
import { OutboundAccountView } from "@/interfaces/outbound";

interface DataTableProps<TValue> {
  columns: ColumnDef<OutboundAccountView, TValue>[];
  data: OutboundAccountView[];
  isLoading: boolean;
}

export function DataTable<TValue>({ columns, data, isLoading }: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalSearch,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter: globalSearch,
      columnVisibility,
    },
  });

  const isMember = CurrentUserRoleType === "Member";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search ..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="max-w-xs px-4 h-9"
        />
        <DataTableToggleColumn table={table} className="ml-auto" />
      </div>
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="font-medium">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex justify-center items-center gap-2">
                    <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
                    Fetching data, please wait ...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : globalSearch ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12">
                  <div className="flex flex-col justify-center items-center">
                    <Icons.illustration.searchEmptyResult
                      strokeWidth={0.75}
                      className="size-36 text-muted-foreground mb-5 bg-background rounded-full p-5 border-2 border-dashed"
                    />
                    <span className="text-lg font-semibold mb-1">No results found</span>
                    <span className="max-w-lg text-muted-foreground text-pretty text-center">
                      We can&apos;t find any record matching your search for &#34;{globalSearch}
                      &#34;.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12">
                  <div className="flex flex-col justify-center items-center">
                    <Icons.illustration.noData
                      strokeWidth={0.75}
                      className="size-36 text-muted-foreground mb-5 bg-background rounded-full p-5 border-2 border-dashed"
                    />
                    <span className="text-lg font-semibold mb-1">
                      There are no records available
                    </span>
                    <span className="max-w-lg text-muted-foreground text-pretty text-center">
                      Newly added account by your team member will go here for your approval.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
