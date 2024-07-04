"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { columnInbound } from "./_components/column-inbound";
import { columnOutbound } from "./_components/column-outbound";
import { DataTableInbound } from "./_components/data-table-inbound";
import { DataTableOutbound } from "./_components/data-table-outbound";

const InboundPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const outbounds = useQuery(api.outbound.get, { status: "Open" });
  const inbounds = useQuery(api.inbound.get, {});

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      const userRole = user.organizationMemberships?.[0]?.role || "";
      if (userRole !== "org:manager_inbound") {
        router.push("/");
      }
    }
  }, [user, router]);

  if (!user || user.organizationMemberships?.[0]?.role !== "org:manager_inbound") {
    return null;
  }

  return (
    <>
      <section>
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>Open Accounts</CardTitle>
            <CardDescription>All records of open accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTableOutbound
              columns={columnOutbound}
              data={outbounds ?? []}
              isLoading={!outbounds}
            />
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>Billed Accounts</CardTitle>
            <CardDescription>All records of billed accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTableInbound columns={columnInbound} data={inbounds ?? []} isLoading={!inbounds} />
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default InboundPage;
