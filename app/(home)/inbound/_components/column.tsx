"use client";

import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateFormat, formatDateRange, formatTimestamp, TimeFormat } from "@/config/global";
import { CurrentUserID } from "@/config/user";
import { OutboundStatuses } from "@/constants/outbound-statuses";
import { OutboundView } from "@/interfaces/outbound";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

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
      const isCreator = CurrentUserID === rowData.authorRefID;
      const updaterUserFullName = "(User Full Name Here)";
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
                <div className="flex flex-col gap-1.5 text-muted-foreground">
                  <div className="flex items-center">
                    <Icons.user className="min-h-4 min-w-4 size-4 mr-2" />
                    {rowData.status === "Open" ? "Approved" : rowData.status} by
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
    id: "actionsAndCreator",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      const isCreator = CurrentUserID === rowData.authorRefID;
      // const isManager = CurrentUserRoleType === "Manager";
      const isOpen = rowData.status === "Open";
      const showCancel = isOpen;

      // const handleCancel = () => {
      //   if (rowData.docID) {
      //     updateOutboundAccount(rowData.docID, {
      //       status: "Cancelled",
      //       statusUpdatedBy: {
      //         userID: CurrentUserID,
      //         userFirstName: CurrentUserFirstName,
      //         userLastName: CurrentUserLastName,
      //         timestamp: Timestamp.now(),
      //       },
      //     });
      //   }
      // };

      return (
        <div className="flex justify-end gap-4">
          {/* Creator */}
          <HoverCard>
            <HoverCardTrigger asChild className="w-auto">
              <div className="flex items-center justify-end gap-2 cursor-pointer group">
                <span className="text-muted-foreground group-hover:underline truncate">
                  by Author
                </span>
                <Avatar className="size-6">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </div>
            </HoverCardTrigger>
            <HoverCardContent align="end">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold flex gap-1 items-center">
                    (Author full name)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icons.calendarAdd className="size-4 " />
                      <span className="text-xs ">
                        added on {format(rowData._creationTime!, DateFormat)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icons.timestamp className="size-4 " />
                      <span className="text-xs ">
                        posted at {format(rowData._creationTime!, TimeFormat)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Actions */}
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
                  navigator.clipboard.writeText(rowData._id ?? "");
                  toast("Copied to clipboard.");
                }}>
                <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
                Copy ID
              </DropdownMenuItem>
              {showCancel && (
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <Icons.actionReject className="min-w-4 min-h-4 size-4 mr-3" />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
