"use client";

import { Icons } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { calculatePercentage, formatDateRange } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { toast } from "sonner";
import { columnBillings } from "./_components/column-billings";
import { DataTable } from "./_components/data-table";

const InboundAccountPage = ({ params }: { params: { id: string } }) => {
  const inbounds = useQuery(api.inbound.get, { inboundID: params.id as Id<"inboundAccounts"> });
  const inbound = inbounds ? inbounds[0] : null;
  const billingsWithCollection = useQuery(api.billings.getByRef, { ref_ID: params.id });

  if (inbound) {
    const totalBilled = inbound.billings?.reduce((n, { amount }) => n + amount, 0);
    let totalCollections = 0;

    inbound.billings?.forEach((billing) => {
      billing.collections?.forEach((collection) => {
        totalCollections += collection.amount;
      });
    });

    const billingPercentage = calculatePercentage(totalBilled ?? 0, inbound.billable_amount);
    const collectedPercentage = calculatePercentage(totalCollections, totalBilled ?? 0);

    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/inbound">Accounts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{params.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="grid grid-cols-2 gap-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Account Information</p>
                <Icons.display.information className="min-w-6 min-h-6 size-6 text-muted-foreground" />
              </div>
              <CardTitle className="flex gap-2 items-center">
                <div className="rounded-full min-w-2 min-h-2 size-2 bg-yellow-500"></div>
                {inbound.clientName}
                <span className="border rounded-md px-2 py-0.5 text-sm truncate dark:text-muted-foreground">
                  {inbound.clientCode}
                </span>
              </CardTitle>
              <CardDescription>
                Account code: <span className="text-primary font-medium">{inbound.code}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mt-1 mb-5" />
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex gap-3 items-center">
                  <Icons.display.group className="min-w-4 min-h-4 size-4 text-muted-foreground" />
                  <p className="truncate">{inbound.groupName}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Icons.display.subgroup className="min-w-4 min-h-4 size-4 text-muted-foreground" />
                  <p className="truncate">
                    {inbound.subgroupName ? inbound.subgroupName : "No Subgroup"}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <Icons.display.dateRange className="min-w-4 min-h-4 size-4 text-muted-foreground" />
                  <p className="truncate">
                    {formatDateRange({
                      from: inbound.datePeriod?.from!,
                      to: inbound.datePeriod?.to!,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Total Billed</p>
                  <Icons.display.account className="min-w-6 min-h-6 size-6 text-muted-foreground" />
                </div>
                <CardTitle className="overflow-hidden text-ellipsis text-blue-500">
                  {totalBilled?.toLocaleString("en-us", {
                    currency: "PHP",
                    style: "currency",
                  })}
                </CardTitle>
                <CardDescription>
                  Out of{" "}
                  <span className="text-primary font-medium">
                    {inbound.billable_amount?.toLocaleString("en-us", {
                      currency: "PHP",
                      style: "currency",
                    })}
                  </span>{" "}
                  billable amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="-mt-0.5 mb-5" />
                <div className="flex gap-4 items-center">
                  <Progress value={billingPercentage} className="[&>*]:bg-blue-600 h-3" />
                  <p className="text-sm font-medium">{billingPercentage}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Total Collection</p>
                  <Icons.display.account className="min-w-6 min-h-6 size-6 text-muted-foreground" />
                </div>
                <CardTitle className="overflow-hidden text-ellipsis text-emerald-500">
                  {totalCollections?.toLocaleString("en-us", {
                    currency: "PHP",
                    style: "currency",
                  })}
                </CardTitle>
                <CardDescription>
                  Out of{" "}
                  <span className="text-primary font-medium">
                    {totalBilled?.toLocaleString("en-us", {
                      currency: "PHP",
                      style: "currency",
                    })}
                  </span>{" "}
                  total billings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="-mt-0.5 mb-5" />
                <div className="flex gap-4 items-center">
                  <Progress value={collectedPercentage} className="[&>*]:bg-emerald-600 h-3" />
                  <p className="text-sm font-medium">{collectedPercentage}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full flex items-center px-6 py-4">
            <div>
              <p className="font-medium text-sm">Outbound Total Amount</p>
              <p className="text-lg font-semibold text-red-500">
                {inbound.amount?.toLocaleString("en-us", {
                  currency: "PHP",
                  style: "currency",
                })}
              </p>
            </div>
            <Separator orientation="vertical" className="mx-6" />
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {inbound.categories.map((item, index) => (
                <p
                  key={index}
                  className="text-sm px-3 py-1 bg-red-500/15 dark:bg-red-500/10 text-red-500 rounded-md">
                  {item.name} -{" "}
                  {item.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </p>
              ))}
            </div>
            <Button
              className="ml-auto"
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                navigator.clipboard.writeText(inbound.outbound_ref_ID ?? "");
                toast("Copied to clipboard.");
              }}>
              <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-2" />
              Copy Outbound ID
            </Button>
          </Card>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Billings</CardTitle>
              <CardDescription>
                These are the list of billings and there collections for this account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columnBillings}
                data={billingsWithCollection ?? []}
                isLoading={!billingsWithCollection}
                accountID={params.id}
              />
            </CardContent>
          </Card>
        </section>
      </>
    );
  } else {
    return <p>Invald ID</p>;
  }
};

export default InboundAccountPage;
