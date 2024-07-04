"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { OutboundView } from "@/interfaces/outbound";
import { inboundAccountSchema } from "@/validators/add-inbound-account";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  row: Row<OutboundView>;
}

const DialogFormAddAccountInbound = ({ open, setOpen, row }: Props) => {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getID);
  const openedOutboundAccounts = useQuery(api.outbound.get, { status: "Open" });
  const updateStatus = useMutation(api.outbound.updateStatus);
  const createInboundAccount = useMutation(api.inbound.create);

  const form = useForm<z.infer<typeof inboundAccountSchema>>({
    resolver: zodResolver(inboundAccountSchema),
    defaultValues: {
      billableAmount: 0,
      outboundAmount: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof inboundAccountSchema>) => {
    if (!user) {
      toast("Unable to continue", {
        description: "Can't retrieve user information. Please logout and login again.",
      });
      return;
    }
    if (!row) {
      toast("Something went wrong", {
        description: "Can't retrieve outbound account information. Please try again.",
      });
      return;
    }
    try {
      const matchedAccount = openedOutboundAccounts?.find((f) => f._id === row.original._id);
      if (!matchedAccount) {
        toast("Uh oh", {
          description: "This outbound account is not currently open. Please try again.",
        });
        return;
      }

      createInboundAccount({
        author_ref_ID: currentUser!,
        billable_amount: data.billableAmount,
        client_ref_ID: row.original.clientRefID as Id<"clients">,
        outbound_ref_ID: row.original._id! as Id<"outboundAccounts">,
      });

      updateStatus({
        id: row.original._id as Id<"outboundAccounts">,
        userID: currentUser!,
        status: "Completed",
      });

      toast("You have successfully added an inbound account!");
      setOpen(false);
    } catch (err) {
      console.log("dialog-form-add-account-inbound:onSubmit;", err);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (row) {
    const rowData = row.original;
    form.setValue("outboundAmount", rowData.totalAmount);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inbound Account</DialogTitle>
            <DialogDescription>Enter the billable amount below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="px-5 py-4 border rounded-lg border-dashed">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-1.5 justify-between items-center">
                    <div className="bg-blue-500 rounded-full min-w-2 min-h-2 size-2"></div>
                    <span className="font-semibold text-sm">Outbound Account</span>
                  </div>
                  <Icons.display.account className="min-w-5 min-h-5 size-5 text-muted-foreground" />
                </div>
                <p className="font-bold text-2xl mb-0.5">
                  {rowData.totalAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </p>
                <div className="mb-4 flex flex-wrap gap-1">
                  {rowData.categories.map((item, index) => (
                    <p
                      key={index}
                      className="text-sm px-2.5 py-0.5 bg-blue-500/15 dark:bg-blue-500/10 text-blue-500 rounded-full">
                      {item.name} -{" "}
                      {item.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {rowData.code} | {rowData.groupName}{" "}
                  {rowData.subgroupName ? `| ${rowData.subgroupName}` : ""}
                </p>
              </div>
              <FormField
                control={form.control}
                name="billableAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billable Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter billable amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="mt-3">
                  Add Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
};

export default DialogFormAddAccountInbound;
