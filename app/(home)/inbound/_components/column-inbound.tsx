"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { formatDateRange } from "@/config/global";
import { InboundView } from "@/interfaces/inbound";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ActionCellInbound } from "./data-table-action-inbound";

const multiValueFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue)) return true;
  return filterValue.includes(row.getValue(columnId));
};

export const columnInbound: ColumnDef<InboundView>[] = [
  {
    id: "clientInfo",
    enableHiding: false,
    accessorFn: (row) => `${row._id} ${row.clientCode} ${row.clientName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Client/Code" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex flex-col">
          <div className="flex items-center truncate gap-1.5">
            <span className={cn("rounded-full min-w-2 min-h-2 size-2 bg-yellow-500")}></span>
            {rowData.clientName}
            <span className="border rounded-md px-1 py-0.5 text-xs truncate dark:text-muted-foreground">
              {rowData.clientCode}
            </span>
          </div>
          <span className="text-xs text-muted-foreground pl-3.5 font-normal">{rowData.code}</span>
        </div>
      );
    },
  },
  {
    id: "Group",
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Group/Subgroup" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <>
          <p className="text-muted-foreground">{rowData.groupName}</p>
          <p className="text-xs text-muted-foreground font-normal">{rowData.subgroupName}</p>
        </>
      );
    },
  },
  {
    id: "Date Period",
    accessorKey: "datePeriod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Date" align="start" title="Date Period" />
    ),
    cell: ({ row }) => {
      if (row.original.datePeriod) {
        const fromDate = row.original.datePeriod.from;
        const toDate = row.original.datePeriod.to;
        return (
          <div className="truncate text-muted-foreground">
            {formatDateRange({ from: fromDate!, to: toDate! })}
          </div>
        );
      } else {
        return <p>Unknown Date</p>;
      }
    },
  },
  {
    id: "Billable",
    accessorKey: "billable_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Billable" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center items-end">
          {row.original.billable_amount.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
          <p className="text-xs text-muted-foreground font-normal">
            {row.original.amount?.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
          </p>
        </div>
      );
    },
  },
  {
    id: "Unbilled",
    accessorFn: (row) => {
      return row.billable_amount - row.totalBillings;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Unbilled" />
    ),
    cell: ({ row }) => {
      const unbilled = row.original.billable_amount - row.original.totalBillings;

      return (
        <div className="text-right">
          {unbilled.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </div>
      );
    },
  },
  {
    id: "Billed",
    accessorKey: "billings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Billed" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right text-blue-500 font-semibold">
          {row.original.totalBillings.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
          {row.original.totalBillings !== 0 && (
            <p className="text-xs text-muted-foreground font-normal">
              {row.original.billings?.length} billing(s)
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "Collected",
    accessorKey: "totalCollections",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Collected" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right text-emerald-500  font-semibold">
          {row.original.totalCollections.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
          {row.original.collectionCount !== 0 && (
            <p className="text-xs text-muted-foreground font-normal">
              {row.original.collectionCount} collection(s)
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "Billed Balance",
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Billed Balance" />
    ),
    cell: ({ row }) => {
      return (
        <div className={cn("text-right font-semibold", row.original.balance > 0 && "text-red-500")}>
          {row.original.balance.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    size: 10,
    cell: (props) => <ActionCellInbound {...props} />,
  },
];
