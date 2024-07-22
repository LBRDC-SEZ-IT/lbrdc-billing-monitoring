import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { calculatePercentage, DateFormat, isOverdue } from "@/config/global";
import { BillingStatuses } from "@/constants/billing-statuses";
import { BillingWithCollectionRemarks } from "@/interfaces/billing";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import ActionBilling from "./action-billing";
import ButtonCollectTrigger from "./button-collect-trigger";
import SubRowCollections from "./sub-row-collections";

export const columnBillings: ColumnDef<BillingWithCollectionRemarks>[] = [
  {
    id: "Code",
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Code" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          {data.billingRemarksCount! > 0 && (
            <div className="flex items-center border w-fit px-1.5 py-0.5 gap-1 rounded-md">
              <Icons.display.remarks strokeWidth={1.75} className="min-w-3.5 min-h-3.5 size-3.5" />
              <span className="text-xs font-semibold">{data.billingRemarksCount}</span>
            </div>
          )}
          <p className="font-semibold">{data.code}</p>
        </div>
      );
    },
  },
  {
    id: "Date of Billing",
    accessorFn: (row) => format(parseISO(row.timestamp), DateFormat),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Date" align="start" title="Date of Billing" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-muted-foreground">
          {format(parseISO(row.original.timestamp), DateFormat)}
        </p>
      );
    },
  },
  {
    id: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="start" title="Status" />
    ),
    accessorFn: (row) => {
      let totalCollections = 0;
      row.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });
      return calculatePercentage(totalCollections, row.amount);
    },
    size: 250,
    cell: ({ row }) => {
      const rowData = row.original;
      let totalCollections = 0;

      rowData.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });

      const balance = rowData.amount - totalCollections;
      const isCollected = balance === 0;
      const isInProgress = balance > 0;
      const isOverDue = isInProgress && isOverdue(rowData.timestamp);

      const rowStatus = isCollected ? "Collected" : isOverDue ? "Overdue" : "Pending";
      const status = BillingStatuses.find((f) => f.value === rowStatus);

      const value = calculatePercentage(totalCollections, rowData.amount);

      return (
        <div className="grid grid-cols-4 items-center gap-x-3">
          <Progress
            className={cn("h-2 col-span-3", `[&>*]:bg-${status?.textColor.substring(5)}`)}
            value={value}
          />
          <div>{value}%</div>
          <p className={cn("text-xs col-span-full uppercase", status?.textColor)}>
            {status?.label}
          </p>
        </div>
      );
    },
  },
  {
    id: "Billed Amount",
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Billed Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {row.original.amount.toLocaleString("en-us", {
            currency: "PHP",
            style: "currency",
          })}
        </div>
      );
    },
  },
  {
    id: "Collections",
    accessorFn: (row) => {
      let totalCollections = 0;
      row.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });
      return totalCollections;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Collections" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      let totalCollections = 0;

      rowData.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });

      return (
        <div className="text-right text-emerald-500">
          {totalCollections.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
          {rowData.collections && rowData.collections?.length > 0 && (
            <p className="text-xs text-muted-foreground font-normal">
              {rowData.collections.length} collection(s)
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "Balance",
    accessorFn: (row) => {
      let totalCollections = 0;
      row.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });
      return row.amount - totalCollections;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Number" align="end" title="Balance" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      let totalCollections = 0;
      let balance = 0;

      rowData.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });

      balance = rowData.amount - totalCollections;

      return (
        <div className={cn("text-right", balance !== 0 && "text-red-500")}>
          {balance.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </div>
      );
    },
  },
  {
    id: "ExpandAndActions",
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="flex flex-1">
            <ButtonCollectTrigger billingID={row.original._id} />
          </div>
          <div className="flex items-center justify-between">
            <ActionBilling row={row} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => row.toggleExpanded()} variant={"ghost"} size={"icon"}>
                  {row.getIsExpanded() ? (
                    <Icons.actionCollapse className="min-h-4 min-w-4 size-4" />
                  ) : (
                    <Icons.actionExpand className="min-h-4 min-w-4 size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{row.getIsExpanded() ? "Collapse" : "Expand"}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      );
    },
  },
  {
    id: "ExpandedContent",
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => {
      return row.getIsExpanded() && <SubRowCollections row={row} />;
    },
  },
];
