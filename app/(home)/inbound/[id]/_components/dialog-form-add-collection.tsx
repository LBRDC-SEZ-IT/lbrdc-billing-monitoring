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
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  billingID: string;
  onOpenChange: () => void;
}

const DialogFormAddCollection = ({ billingID, onOpenChange }: Props) => {
  const billing = useQuery(api.billings.getWithCollectionByID, { ID: billingID as Id<"billings"> });
  const createCollection = useMutation(api.collection.create);

  let totalCollections = 0;
  let balance = 0;

  billing?.collections?.forEach((collection) => {
    totalCollections += collection.amount;
  });

  balance = billing ? billing.amount - totalCollections : 0;

  const schema = useMemo(
    () =>
      z.object({
        code: z.string().refine((value) => value !== "", "Please provide an OR number."),
        amount: z.coerce
          .number()
          .min(1, "Amount cannot be zero or below.")
          .max(
            balance,
            `Amount cannot exceed the collectible amount of ${balance.toLocaleString("en-us", { currency: "PHP", style: "currency" })}.`
          )
          .refine((value) => !isNaN(value), "Amount cannot be blank."),
        date: z.date(),
      }),
    [balance]
  );

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
      createCollection({
        amount: data.amount,
        billing_ref_ID: billingID as Id<"billings">,
        code: data.code,
        date: data.date.toISOString(),
      });

      toast("You have successfully added a collection for this billing!");
      onOpenChange();
    } catch (err) {
      console.log("dialog-form-add-collection:onSubmit; ", err);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collection</DialogTitle>
          <DialogDescription>New collection for this billing.</DialogDescription>
        </DialogHeader>
        {billing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">Collectible amount</p>
                    <Icons.display.account className="min-w-6 min-h-6 size-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="overflow-hidden text-ellipsis text-emerald-500">
                    {balance.toLocaleString("en-us", {
                      currency: "PHP",
                      style: "currency",
                    })}
                  </CardTitle>
                  <CardDescription className="pb-0.5">
                    Out of{" "}
                    <span className="text-primary font-medium">
                      {billing.amount.toLocaleString("en-us", {
                        currency: "PHP",
                        style: "currency",
                      })}
                    </span>{" "}
                    billed amount
                  </CardDescription>
                </CardHeader>
              </Card>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OR Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter OR number" {...field} />
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
                        placeholder="Enter collected amount"
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
                    <FormLabel>Date of collection</FormLabel>
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
                  Add Collection
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="flex justify-center items-center gap-2 py-24">
            <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
            Fetching billing information, please wait ...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormAddCollection;
