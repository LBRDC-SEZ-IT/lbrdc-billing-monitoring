import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GroupView } from "@/interfaces/group";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "./table-actions";
import TableExpandedContent from "./table-expanded-content";

export const column: ColumnDef<GroupView>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Name" />
    ),
  },
  {
    id: "Client",
    accessorFn: (row) => `${row.client_info.name} ${row.client_info.code}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} type="Text" align="start" title="Client" />
    ),
    cell: ({ row }) => {
      const client = row.original.client_info;
      return <p>{`${client.code} - ${client.name}`}</p>;
    },
  },
  {
    id: "Actions",
    enableHiding: false,
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
