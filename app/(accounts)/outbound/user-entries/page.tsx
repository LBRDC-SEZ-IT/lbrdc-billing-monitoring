"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrentUserID } from "@/config/user";
import { getOutboundAccountsView } from "@/services/OutboundAccountsService";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";

export default function UserEntriesPage() {
  const { accounts, loading } = getOutboundAccountsView({
    addOrderBy: "createdBy.timestamp",
    creatorID: CurrentUserID,
  });

  return (
    <>
      <section className="p-8">
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>Your Entries</CardTitle>
            <CardDescription>All of your entries.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable columns={columns} data={accounts} isLoading={loading} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
