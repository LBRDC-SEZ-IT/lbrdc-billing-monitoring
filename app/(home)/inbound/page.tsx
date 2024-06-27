"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";

const InboundPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const outbounds = useQuery(api.outbound.get, {});

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
      <section className="p-8">
        <Card>
          <CardHeader className="px-8 pt-8">
            <CardTitle>Inbound</CardTitle>
            <CardDescription>All records of outgoing accounts.</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <DataTable columns={columns} data={outbounds ?? []} isLoading={!outbounds} />
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default InboundPage;
