"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { convertToMoney } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  className?: string;
  accountID: string;
}

const DialogFormAddBilling = ({ className, accountID }: Props) => {
  const createBilling = useMutation(api.billings.create);
  const inbounds = useQuery(api.inbound.get, { inboundID: accountID as Id<"inboundAccounts"> });
  const inbound = inbounds ? inbounds[0] : null;

  const totalBilled = inbound?.billings?.reduce((n, { amount }) => n + amount, 0) || 0;
  const billable = inbound ? inbound.billable_amount - totalBilled : 0;

  const [isOpen, setIsOpen] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        code: z.string(),
        amount: z.coerce
          .number()
          .min(1, "Amount cannot be zero or below.")
          .max(
            billable,
            `Amount cannot exceed the available amount of ${billable.toLocaleString("en-us", { currency: "PHP", style: "currency" })}.`
          )
          .refine((value) => !isNaN(value), "Amount cannot be blank."),
        date: z.date(),
      }),
    [billable]
  );

  const billingNumber = useMemo(() => inbound?.billings?.length, [inbound?.billings]);
  const formattedBillingNumber = String((billingNumber ?? 0) + 1).padStart(4, "0");
  const recommendedCode = `BILLING_${formattedBillingNumber}`;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      amount: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      createBilling({
        account_ref_ID: accountID as Id<"inboundAccounts">,
        amount: data.amount,
        code: data.code === "" ? recommendedCode : data.code,
        date: data.date.toISOString(),
      });

      toast("You have successfully added a billing for this account!");
      setIsOpen(false);
    } catch (err) {
      console.log("dialog-form-add-billing:onSubmit;", err);
    }
  };

  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  if (inbound) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className={cn(className)} size={"sm"}>
            Add Billing
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Billing</DialogTitle>
            <DialogDescription>New billing for this account.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">Available amount</p>
                    <Icons.display.account className="min-w-6 min-h-6 size-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="overflow-hidden text-ellipsis text-blue-500">
                    {billable.toLocaleString("en-us", {
                      currency: "PHP",
                      style: "currency",
                    })}
                  </CardTitle>
                  <CardDescription className="pb-0.5">
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
              </Card>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={recommendedCode} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter billable amount"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount Preview: {convertToMoney(Number(field.value) || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of billing</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "px-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "LLL dd, y")
                            ) : (
                              <span>Pick a collection date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          required
                          defaultMonth={field.value}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="mt-4">
                  Add Billing
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={cn(className)} size={"sm"}>
            Add Billing
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Billing</DialogTitle>
            <DialogDescription>New billing for this account.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center gap-2">
            <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
            Fetching data, please wait ...
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default DialogFormAddBilling;
