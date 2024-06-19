"use client";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateFormat, TimeFormat } from "@/config/global";
import { CurrentUserID } from "@/config/user";
import { OutboundAccountView, OutboundStatuses } from "@/interfaces/outbound";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

const multiValueFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue)) return true;
  return filterValue.includes(row.getValue(columnId));
};

export const columns: ColumnDef<OutboundAccountView>[] = [
  {
    id: "clientInfo",
    size: 350,
    enableHiding: false,
    accessorFn: (row) => `${row.docID} ${row.code} ${row.clientCode} ${row.clientName}`,
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
    id: "Development",
    accessorKey: "developmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Development" />
    ),
    cell: ({ row }) => {
      const account = row.original;
      return <div className=" max-w-32">{account.developmentName}</div>;
    },
  },
  {
    id: "Date Period",
    accessorKey: "datePeriod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Date" align="start" title="Date Period" />
    ),
    cell: ({ row }) => {
      const account = row.original;
      return <div className="">{account.datePeriod}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Status" />
    ),
    filterFn: multiValueFilter,
    cell: ({ row }) => {
      const account = row.original;
      const status = OutboundStatuses.find((status) => status.value === account.status);
      const isCreator = CurrentUserID === account.statusUpdatedBy.userID;
      const updaterUserFullName = `${account.statusUpdatedBy.userFirstName} ${account.statusUpdatedBy.userLastName}`;
      const formattedDate = format(account.statusUpdatedBy.timestamp.toDate(), "MMMM dd, yyyy");
      const formattedTime = format(account.statusUpdatedBy.timestamp.toDate(), "hh:mm a");

      return (
        <div className="flex cursor-default">
          {status && (
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
                      <>
                        <status.icon className="min-h-4 min-w-4 size-4" />
                        <span className="">{status.label}</span>
                      </>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-auto p-3">
                    <div className="flex flex-col gap-1.5 text-muted-foreground">
                      <div className="flex items-center">
                        <Icons.user className="min-h-4 min-w-4 size-4 mr-2" />
                        {account.status === "Open"
                          ? "Approved"
                          : account.status === "Approval"
                          ? "Posted"
                          : account.status}{" "}
                        by
                        <span className="text-foreground ml-1">
                          {isCreator ? "You" : updaterUserFullName}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Icons.calendarClock className="min-h-4 min-w-4 size-4" />
                        <span className="text-foreground -mr-1">{formattedDate}</span>at
                        <span className="text-foreground -ml-1">{formattedTime}</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
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
            {rowData.payableCategories.map((category) => (
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
    id: "actions",
    accessorKey: "createdBy.timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        type="Date"
        align="end"
        title="Date/Time"
        className="pr-14"
      />
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex justify-end gap-4">
          <div className="text-right flex flex-col justify-center">
            {format(rowData.createdBy.timestamp.toDate(), DateFormat)}
            <span className="text-muted-foreground text-xs">
              {format(rowData.createdBy.timestamp.toDate(), TimeFormat)}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Icons.actions className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              <DropdownMenuItem>
                <Icons.actionView className="min-w-4 min-h-4 size-4 mr-3" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(rowData.docID ?? "");
                  toast("Copied to clipboard.");
                }}>
                <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
                Copy ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
