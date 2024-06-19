"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOutboundAccountsView } from "@/services/OutboundAccountsService";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";

export default function ApprovalsPage() {
  const { accounts, loading } = getOutboundAccountsView({
    addOrderBy: "createdBy.timestamp",
    specificStatuses: ["Approval"],
  });

  return (
    <>
      <section className="p-8">
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>For Approvals</CardTitle>
            <CardDescription>All waiting for approval accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable columns={columns} data={accounts} isLoading={loading} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
