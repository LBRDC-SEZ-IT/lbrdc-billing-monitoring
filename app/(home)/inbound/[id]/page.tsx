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
import { calculatePercentage, convertToMoney, formatDateRange } from "@/config/global";
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
  const billingsWithCollectionRemarks = useQuery(api.billings.getByRef, { ref_ID: params.id });

  if (inbound) {
    const billingPercentage = calculatePercentage(inbound.totalBillings, inbound.billable_amount);
    const collectedPercentage = calculatePercentage(
      inbound.totalCollections,
      inbound.totalBillings ?? 0
    );

    const unbilledAmount = inbound.billable_amount - inbound.totalBillings;
    const uncollectedAmount = inbound.totalBillings - inbound.totalCollections;

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
              <CardDescription className="space-y-2">
                <p>
                  Account code: <span className="text-primary font-medium">{inbound.code}</span>
                </p>
                <p className="text-primary bg-muted px-3 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                  <Icons.display.contract className="min-w-4 min-h-4 size-4 mr-1.5" />
                  July 5, 2023 - July 5, 2024
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <Separator className="mt-1 mb-3.5" />
              <div className="grid grid-cols-3 gap-4 text-sm font-semibold">
                <div className="flex gap-3 items-center">
                  <span className="p-2 rounded-full bg-muted">
                    <Icons.display.group className="min-w-4 min-h-4 size-4" />
                  </span>
                  <p className="truncate">{inbound.groupName}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="p-2 rounded-full bg-muted">
                    <Icons.display.subgroup className="min-w-4 min-h-4 size-4" />
                  </span>
                  <p className="truncate">
                    {inbound.subgroupName ? inbound.subgroupName : "No Subgroup"}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="p-2 rounded-full bg-muted">
                    <Icons.display.dateRange className="min-w-4 min-h-4 size-4" />
                  </span>
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
                  {convertToMoney(inbound.totalBillings)}
                </CardTitle>
                <CardDescription className="space-y-2">
                  <p>
                    Out of{" "}
                    <span className="text-primary font-medium">
                      {convertToMoney(inbound.billable_amount)}
                    </span>{" "}
                    billable amount
                  </p>
                  {unbilledAmount !== 0 ? (
                    <p className="bg-red-500/20 text-red-500 px-2 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                      <Icons.display.incomplete className="min-w-4 min-h-4 size-4 mr-1" />
                      <span className="font-semibold mr-1">{convertToMoney(unbilledAmount)}</span>
                      unbilled amount
                    </p>
                  ) : (
                    <p className="bg-blue-500/20 text-blue-500 px-2 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                      <Icons.display.complete className="min-w-4 min-h-4 size-4 mr-1" />
                      Fully Billed
                    </p>
                  )}
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
                  {convertToMoney(inbound.totalCollections)}
                </CardTitle>
                <CardDescription className="space-y-2">
                  <p>
                    Out of{" "}
                    <span className="text-primary font-medium">
                      {convertToMoney(inbound.totalBillings)}
                    </span>{" "}
                    total billings
                  </p>
                  {uncollectedAmount !== 0 ? (
                    <p className="bg-red-500/20 text-red-500 px-2 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                      <Icons.display.incomplete className="min-w-4 min-h-4 size-4 mr-1" />
                      <span className="font-semibold mr-1">
                        {convertToMoney(uncollectedAmount)}
                      </span>
                      uncollected amount
                    </p>
                  ) : inbound.totalBillings === 0 ? (
                    <p className="bg-red-500/20 text-red-500 px-2 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                      <Icons.display.incomplete className="min-w-4 min-h-4 size-4 mr-1" />
                      No billings yet
                    </p>
                  ) : (
                    <p className="bg-emerald-500/20 text-emerald-500 px-2 py-1.5 rounded-full w-fit font-medium text-xs flex items-center">
                      <Icons.display.complete className="min-w-4 min-h-4 size-4 mr-1" />
                      Fully Collected
                    </p>
                  )}
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
                {convertToMoney(inbound.amount ?? 0)}
              </p>
            </div>
            <Separator orientation="vertical" className="mx-6" />
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {inbound.categories.map((item, index) => (
                <p
                  key={index}
                  className="text-sm px-3 py-1 bg-red-500/15 dark:bg-red-500/10 text-red-500 rounded-md">
                  {item.name} - {convertToMoney(item.amount)}
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
                data={billingsWithCollectionRemarks ?? []}
                isLoading={!billingsWithCollectionRemarks}
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
