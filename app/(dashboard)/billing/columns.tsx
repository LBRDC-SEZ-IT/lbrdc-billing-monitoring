"use client";

import AddBilling from "@/components/add-billing";
import { Billing } from "@/interfaces/billing";
import { Payroll } from "@/interfaces/payroll";
import { ColumnDef } from "@tanstack/react-table";

export const payrollColumns: ColumnDef<Payroll>[] = [
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Date Period</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("date")}</div>;
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
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const payroll = row.original;

      return (
        <div className="flex justify-center">
          <AddBilling payroll={payroll} />
        </div>
      );
    },
  },
];

export const billingColumns: ColumnDef<Billing>[] = [
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
