"use client";

import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateFormat, formatDateRange, formatTimestamp, TimeFormat } from "@/config/global";
import { OutboundStatuses } from "@/constants/outbound-statuses";
import { OutboundView } from "@/interfaces/outbound";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { ActionCell } from "./data-table-cell-action";

const multiValueFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue)) return true;
  return filterValue.includes(row.getValue(columnId));
};

export const columns: ColumnDef<OutboundView>[] = [
  {
    id: "clientInfo",
    size: 350,
    enableHiding: false,
    accessorFn: (row) => `${row._id} ${row.code}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Client/Code" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      const status = OutboundStatuses.find((f) => f.value == rowData.status);

      return (
        <div className="flex flex-col">
          <div className="flex items-center truncate gap-1.5">
            <span
              className={cn(
                "rounded-full min-w-2 min-h-2 size-2",
                status?.bgColor.substring(0, status?.bgColor.length - 3)
              )}></span>
            {rowData.clientName}
            <span className="border rounded-md px-1  py-0.5 text-xs truncate dark:text-muted-foreground">
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
          {rowData.groupName}
          <p className="text-xs text-muted-foreground">{rowData.subgroupName}</p>
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
      const { from, to } = row.original.datePeriod;
      return <div className="truncate">{formatDateRange({ from, to })}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Status" />
    ),
    filterFn: multiValueFilter,
    cell: ({ row }) => {
      const rowData = row.original;
      const status = OutboundStatuses.find((status) => status.value === rowData.status);
      const formattedDate =
        rowData.status === "Open"
          ? rowData.approvalInfo && rowData.approvalInfo?.timestamp !== ""
            ? formatTimestamp(rowData.approvalInfo.timestamp, "Date")
            : "Unknown date"
          : formatTimestamp(rowData.statusInfo.timestamp, "Date");
      const formattedTime =
        rowData.status === "Open"
          ? rowData.approvalInfo && rowData.approvalInfo?.timestamp !== ""
            ? formatTimestamp(rowData.approvalInfo.timestamp, "Time")
            : "Unknown time"
          : formatTimestamp(rowData.statusInfo.timestamp, "Time");

      return (
        <div className="flex cursor-default">
          {status && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-1 pr-2.5 text-sm cursor-pointer",
                    status.bgColor,
                    status.textColor
                  )}>
                  <status.icon className="size-4" />
                  <span className="truncate">{status.label}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-auto p-3">
                <div className="flex gap-2 items-center text-muted-foreground">
                  <Icons.calendarClock className="min-h-4 min-w-4 size-4" />
                  <span className="text-foreground -mr-1">{formattedDate}</span>at
                  <span className="text-foreground -ml-1">{formattedTime}</span>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Amount" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      const amount = parseFloat(row.getValue("totalAmount"));
      const formattedTotalAmount = amount.toLocaleString("en-US", {
        style: "currency",
        currency: "PHP",
      });

      return (
        <HoverCard>
          <HoverCardTrigger asChild className="flex justify-end items-center">
            <span className="truncate cursor-pointer hover:underline hover:underline-offset-2">
              {formattedTotalAmount}
            </span>
          </HoverCardTrigger>
          <HoverCardContent align="end" className="px-3 py-2.5 space-y-1 -mr-[13px]">
            {rowData.categories.map((category) => (
              <span key={category.name} className="text-muted-foreground flex">
                {category.name}
                <span className="ml-auto truncate text-foreground">
                  {category.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </span>
              </span>
            ))}
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "Post Date",
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Date" align="end" title="Post Date" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex flex-col items-end justify-center">
          <span className="truncate">{format(rowData._creationTime!, DateFormat)}</span>{" "}
          <div className="text-xs text-muted-foreground">
            {format(rowData._creationTime!, TimeFormat)}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    size: 10,
    cell: (props) => <ActionCell {...props} />,
  },
];
