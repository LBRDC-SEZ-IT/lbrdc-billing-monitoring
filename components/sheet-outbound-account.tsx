import { DateFormat, formatDateRange, formatTimestamp, TimeFormat } from "@/config/global";
import { OutboundStatuses } from "@/constants/outbound-statuses";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface SheetOutboundAccount {
  open: boolean;
  setOpen: (open: boolean) => void;
  outboundID: string;
}

const SheetOutboundAccount = ({ open, setOpen, outboundID }: SheetOutboundAccount) => {
  const outbounds = useQuery(api.outbound.get, {
    outboundID: outboundID as Id<"outboundAccounts">,
  });

  if (!outbounds) {
    return (
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setTimeout(() => (document.body.style.pointerEvents = ""), 500);
        }}>
        <SheetContent className="flex flex-col justify-between overflow-y-scroll">
          <div className="flex justify-center items-center gap-2 text-sm h-full">
            <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
            Loading account, please wait ...
          </div>
        </SheetContent>
      </Sheet>
    );
  } else {
    const account = outbounds[0];
    const { from, to } = account.datePeriod;
    const formattedDate =
      account.status === "Open"
        ? account.approvalInfo && account.approvalInfo?.timestamp !== ""
          ? formatTimestamp(account.approvalInfo.timestamp, "Date")
          : "Unknown date"
        : formatTimestamp(account.statusInfo.timestamp, "Date");
    const formattedTime =
      account.status === "Open"
        ? account.approvalInfo && account.approvalInfo?.timestamp !== ""
          ? formatTimestamp(account.approvalInfo.timestamp, "Time")
          : "Unknown time"
        : formatTimestamp(account.statusInfo.timestamp, "Time");

    return (
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setTimeout(() => (document.body.style.pointerEvents = ""), 500);
        }}>
        <SheetContent className="flex flex-col justify-between overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Account Details</SheetTitle>
            <SheetDescription>
              Here are the details of this outbound account posted on{" "}
              <span className="text-primary font-semibold">
                {format(account._creationTime!, DateFormat)}
              </span>{" "}
              at{" "}
              <span className="text-primary font-semibold">
                {format(account._creationTime!, TimeFormat)}
              </span>
              .
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-2">
              <Separator className="col-span-full mb-2.5" />
              <div className="col-span-full space-x-2">
                <span
                  className={cn(
                    "rounded-md text-center text-sm px-1.5 py-1 uppercase font-semibold",
                    OutboundStatuses.find((f) => f.value == account.status)?.bgColor,
                    OutboundStatuses.find((f) => f.value == account.status)?.textColor
                  )}>
                  {account.status}
                </span>
                <span className="text-sm">
                  on {formattedDate} at {formattedTime}
                </span>
              </div>
              <Separator className="col-span-full mt-3" />
              <div className="space-y-2 col-span-full">
                <Label htmlFor="id">ID</Label>
                <Input id="id" readOnly value={outboundID} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="code">Code</Label>
                <Input id="code" readOnly value={account.code} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="client">Client</Label>
                <Input id="client" readOnly value={account.clientName} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="group">Group</Label>
                <Input id="group" readOnly value={account.groupName} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="subgroup">Subgroup</Label>
                <Input id="subgroup" readOnly value={account.subgroupName ?? "None"} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="date-period">Date Period</Label>
                <Input id="date-period" readOnly value={formatDateRange({ from, to })} />
              </div>
              <Separator className="col-span-full mt-3 mb-2" />
              <p className="text-sm col-span-full font-medium">Payable Information</p>
              <div className="col-span-full text-sm space-y-2">
                {account.categories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center gap-2">
                    <p className="text-muted-foreground">{category.name}</p>
                    <p className="font-semibold">
                      {category.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="col-span-full mt-3 mb-2" />
              <div className="col-span-full flex justify-between items-center gap-2 text-sm">
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-semibold">
                  {account.totalAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </p>
              </div>
              <Separator className="col-span-full mt-2.5 mb-2" />
            </div>
          </div>
          <SheetFooter>
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                setTimeout(() => (document.body.style.pointerEvents = ""), 500);
              }}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
};

export default SheetOutboundAccount;
