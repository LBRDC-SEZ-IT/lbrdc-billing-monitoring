"use client";

import AddPayroll from "@/components/add-payroll";
import { DataTable } from "@/components/data-table";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getPayrolls } from "@/services/payrollService";
import Link from "next/link";
import { columns } from "./columns";

const PayrollPage = () => {
  const { payrolls } = getPayrolls();

  return (
    <div className="container flex h-screen w-screen flex-col">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant={"ghost"}>
          <Icons.leftArrow className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="flex justify-between items-center w-full mt-24">
        <h2>Payroll Table</h2>
        <AddPayroll />
      </div>

      <DataTable columns={columns} data={payrolls} />
    </div>
  );
};

export default PayrollPage;
