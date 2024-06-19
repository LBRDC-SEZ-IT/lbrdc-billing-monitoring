"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateFormat } from "@/config/global";
import { CurrentUserID, CurrentUserRoleType } from "@/config/user";
import { InboundAccount } from "@/interfaces/inbound";
import { OutboundAccountView, OutboundStatuses } from "@/interfaces/outbound";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

const multiValueFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue)) return true;
  return filterValue.includes(row.getValue(columnId));
};

export const payableColumn: ColumnDef<OutboundAccountView>[] = [
  {
    size: 350,
    accessorKey: "clientName",
    enableHiding: false,
    accessorFn: (row) => `${row.clientCode} ${row.clientName} ${row.docID}`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        type="Text"
        align="start"
        title="Client/Payables"
        className="ml-6"
      />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      const payableCategories = rowData.payableCategories
        .map((category) => category.name)
        .join(", ");

      return (
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center truncate gap-2">
              {rowData.clientName}
              <span className="border rounded-md px-2 py-0.5 text-xs truncate dark:text-muted-foreground">
                {rowData.clientCode}
              </span>
            </div>
            {payableCategories !== "" ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="text-xs text-muted-foreground truncate max-w-56 cursor-pointer mr-auto hover:underline">
                    {payableCategories}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent align="start" className="-ml-3 px-3 py-2.5 space-y-1">
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
            ) : null}
          </div>
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
      return <div className="truncate max-w-32">{account.developmentName}</div>;
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
      return <div className="truncate">{account.datePeriod}</div>;
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
      const formattedDate =
        account.status === "Open"
          ? format(account.approvedBy!.timestamp.toDate(), DateFormat)
          : format(account.createdBy.timestamp.toDate(), DateFormat);
      const formattedTime = format(account.statusUpdatedBy.timestamp.toDate(), "hh:mm a");

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
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = amount.toLocaleString("en-US", {
        style: "currency",
        currency: "PHP",
      });

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    id: "actionsAndCreator",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      const isCreator = CurrentUserID === rowData.createdBy.userID;
      const isManager = CurrentUserRoleType === "Manager";

      return (
        <div className="flex justify-end gap-4">
          {/* Creator */}
          <HoverCard>
            <HoverCardTrigger asChild className="w-auto">
              <div className="flex items-center justify-end gap-2 cursor-pointer group">
                <span className="text-muted-foreground group-hover:underline truncate">
                  by {isCreator ? "You" : rowData.createdBy.userFirstName}
                </span>
                <Avatar className="size-6">
                  <AvatarFallback>{rowData.createdBy.userFirstName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </HoverCardTrigger>
            <HoverCardContent align="end">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>{rowData.createdBy.userFirstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold flex gap-1 items-center">
                    {`${rowData.createdBy.userFirstName} ${rowData.createdBy.userLastName}`}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icons.calendarAdd className="size-4 " />
                      <span className="text-xs ">
                        added on {format(rowData.createdBy.timestamp.toDate(), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icons.timestamp className="size-4 " />
                      <span className="text-xs ">
                        posted at {format(rowData.createdBy.timestamp.toDate(), "hh:mm a")}
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

export const receivableColumn: ColumnDef<InboundAccount>[] = [
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "dateOfPeriod",
    header: "Date Period",
  },
  {
    accessorKey: "payrollAmount",
    header: "Payroll Amount",
  },
  {
    accessorKey: "amountBilled",
    header: "Billed",
  },
  {
    accessorKey: "amountCollected",
    header: "Collected",
  },
  {
    accessorKey: "dateOfCollection",
    header: "Collected Date",
  },
];
