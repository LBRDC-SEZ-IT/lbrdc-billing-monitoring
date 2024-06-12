"use client";

import { DataTable } from "@/components/data-table";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getBillings } from "@/services/billingService";
import { getPayrolls } from "@/services/payrollService";
import Link from "next/link";
import { billingColumns, payrollColumns } from "./columns";

const BillingPage = () => {
  const { payrolls } = getPayrolls("Open For Billing");
  const { billings } = getBillings();

  return (
    <div className="container flex h-screen w-screen flex-col">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant={"ghost"}>
          <Icons.leftArrow className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <h2 className="mt-24">Open for Billing Payrolls Table</h2>

      <DataTable columns={payrollColumns} data={payrolls} />

      <h2>Billing Table</h2>

      <DataTable columns={billingColumns} data={billings} />
    </div>
  );
};

export default BillingPage;
