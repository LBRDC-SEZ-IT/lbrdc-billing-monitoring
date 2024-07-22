"use client";

import * as React from "react";

import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
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
import { cn } from "@/lib/utils";
import DialogFormAddBilling from "./dialog-form-add-billing";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  accountID: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  accountID,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    ExpandedContent: false,
  });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

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
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      sorting,
      globalFilter: globalSearch,
      columnVisibility,
      expanded,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search ..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="max-w-xs px-4 h-9"
        />
        <DialogFormAddBilling className="ml-auto" accountID={accountID} />
        <DataTableToggleColumn table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{ width: header.column.columnDef.size }}>
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
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(row.getIsExpanded() && "border-b-0 bg-muted-foreground/5")}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-2"
                        style={{ width: cell.column.columnDef.size }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow className={cn(row.getIsExpanded() && "bg-muted-foreground/5")}>
                      <TableCell colSpan={columns.length} className="pt-0">
                        {flexRender(columns.find((c) => c.id === "ExpandedContent")!.cell!, {
                          row,
                          column: columns.find((c) => c.id === "ExpandedContent"),
                          cell: {
                            getValue: () => null,
                            renderValue: () => null,
                          },
                        } as any)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
                    <span className="text-lg font-semibold mb-1">There are no billings yet</span>
                    <span className="max-w-lg text-muted-foreground text-pretty text-center">
                      Click &quot;Add Billing&quot; above to create a billing for this account.
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
