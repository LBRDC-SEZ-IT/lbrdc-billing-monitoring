"use client";

import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInboundAccountsView } from "@/services/InboundAccountsService";
import { getOutboundAccountsView } from "@/services/OutboundAccountsService";
import { payableColumn, receivableColumn } from "./_components/columns";

const BillingPage = () => {
  const outboundAccounts = getOutboundAccountsView({ specificStatuses: ["Open"] });
  const inboundAccounts = getInboundAccountsView({});

  return (
    <>
      <section className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Open Outbound Accounts</CardTitle>
            <CardDescription>All records of open for billing outbound accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable columns={payableColumn} data={outboundAccounts.accounts} />
          </CardContent>
        </Card>
      </section>
      <section className="px-8">
        <Card>
          <CardHeader>
            <CardTitle>Open Outbound Accounts</CardTitle>
            <CardDescription>All records of open for billing outbound accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable columns={receivableColumn} data={inboundAccounts.accounts} />
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default BillingPage;
