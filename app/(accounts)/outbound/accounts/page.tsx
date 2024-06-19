"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOutboundAccountsView } from "@/services/OutboundAccountsService";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";

const PayableAccountsPage = () => {
  const allRecords = getOutboundAccountsView({
    addOrderBy: "approvedBy.timestamp",
    specificStatuses: ["Open", "Cancelled", "Completed"],
  });

  return (
    <>
      <section className="p-8">
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>Outbound</CardTitle>
            <CardDescription>All records of outgoing accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable
              columns={columns}
              data={allRecords.accounts}
              isLoading={allRecords.loading}
            />
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayableAccountsPage;
