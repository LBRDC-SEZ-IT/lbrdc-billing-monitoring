import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatDateRange, formatTimestamp } from "@/config/global";
import { ClientStatuses } from "@/constants/client-statuses";
import { Client } from "@/interfaces/client";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "./table-actions";
import TableExpandedContent from "./table-expanded-content";

export const column: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Name" />
    ),
    cell: ({ row }) => {
      return <p className="truncate">{row.original.name}</p>;
    },
  },
  {
    accessorKey: "code",
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Code" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger>
            <p className="line-clamp-1 hover:underline hover:underline-offset-2 cursor-pointer">
              {row.original.description}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-96 w-auto">
            <h2 className="mb-2 font-semibold">Description</h2>
            <p>{row.original.description}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "Current Contract Period",
    accessorFn: (row) => {
      const currentContract = row.contracts.find((f) => f.status === "Active");
      if (currentContract) {
        {
          formatDateRange({ from: currentContract.from_date, to: currentContract.to_date });
        }
      }
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        type="Date"
        align="start"
        title="Current Contract Period"
      />
    ),
    cell: ({ row }) => {
      const currentContract = row.original.contracts.find((f) => f.status === "Active");
      if (currentContract) {
        return (
          <p>{formatDateRange({ from: currentContract.from_date, to: currentContract.to_date })}</p>
        );
      } else {
        return <p>Unable to find active contract date period.</p>;
      }
    },
  },
  {
    id: "Status",
    accessorFn: (row) => {
      const currentContract = row.contracts.find((f) => f.status === "Active");
      return currentContract?.status;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Status" />
    ),
    cell: ({ row }) => {
      const active = row.original.contracts.find((f) => f.status === "Active");
      if (active) {
        if (new Date().setHours(0, 0, 0, 0) > new Date(active.to_date).setHours(0, 0, 0, 0)) {
          return (
            <p
              className={cn(
                "w-fit px-2 py-1 rounded-full",
                ClientStatuses.find((f) => f.value === "End of Contract")?.bgColor,
                ClientStatuses.find((f) => f.value === "End of Contract")?.textColor
              )}>
              Contract Ended
            </p>
          );
        }
        return (
          <p
            className={cn(
              "w-fit px-2 py-1 rounded-full",
              ClientStatuses.find((f) => f.value === active.status)?.bgColor,
              ClientStatuses.find((f) => f.value === active.status)?.textColor
            )}>
            {active.status}
          </p>
        );
      } else {
        return <p>Unable to find active contract date period.</p>;
      }
    },
  },
  {
    id: "Date Added",
    accessorFn: (row) => {
      return formatTimestamp(row._creationTime.toString(), "Date");
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Date Added" />
    ),
    cell: ({ row }) => {
      return <p>{formatTimestamp(row.original._creationTime.toString(), "Date")}</p>;
    },
  },
  {
    id: "ExpandAndActions",
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <TableActions row_id={row.original._id} />
          <Button
            tooltip={row.getIsExpanded() ? "Collapse" : "Expand"}
            onClick={() => row.toggleExpanded()}
            variant={"ghost"}
            size={"icon"}>
            {row.getIsExpanded() ? (
              <Icons.actionCollapse className="min-h-4 min-w-4 size-4" />
            ) : (
              <Icons.actionExpand className="min-h-4 min-w-4 size-4" />
            )}
          </Button>
        </div>
      );
    },
  },
  {
    id: "ExpandedContent",
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => {
      return row.getIsExpanded() && <TableExpandedContent row={row} />;
    },
  },
];
