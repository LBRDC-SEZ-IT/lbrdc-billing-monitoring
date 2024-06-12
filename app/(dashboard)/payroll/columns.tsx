"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Payroll, PayrollStatus } from "@/interfaces/payroll";
import { deletePayroll } from "@/services/payrollService";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Payroll>[] = [
  {
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client
          <Icons.sort className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Date Period</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("date")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue<PayrollStatus>("status");

      return (
        <div className="flex gap-2 items-center">
          {status === "Open For Billing" ? (
            <Icons.statusOpen className="size-4 text-muted-foreground" />
          ) : status === "Billed" ? (
            <Icons.statusComplete className="size-4 text-muted-foreground" />
          ) : null}
          <span className="font-medium">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payroll = row.original;

      const isBilled = row.getValue<PayrollStatus>("status") === "Billed";

      const handleDelete = () => {
        if (payroll.id) {
          deletePayroll(payroll.id);
        }
      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"ghost"} size={"icon"}>
                <Icons.actions className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleDelete} disabled={isBilled}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
