"use client";

import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateFormat } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    contractFromDate: z.date({ required_error: "Please select a start date." }),
    contractToDate: z.date({ required_error: "Please select an end date." }),
  })
  .refine((data) => data.contractToDate >= data.contractFromDate, {
    message: "End date cannot be before start date.",
    path: ["contractToDate"],
  });

interface Props {
  clientID: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DialogFormRenewClient = ({ clientID, ...props }: Props) => {
  const renewClient = useMutation(api.clients.renew);
  const clients = useQuery(api.clients.get, { client_id: clientID });
  const client = clients && clients[0];

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await renewClient({
      clientID: clientID as Id<"clients">,
      new_contract: {
        status: "Active",
        from_date: data.contractFromDate.toISOString(),
        to_date: data.contractToDate.toISOString(),
        timestamp: new Date().toISOString(),
      },
    });

    if (response.success) {
      toast.success(response.message);
      props.setIsOpen(false);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    form.reset();
  }, [props.isOpen, form]);

  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Renew Client&apos;s Contract</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the new contract period for this client.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {client ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="clientName">Selected Client Information</Label>
                <Input
                  id="clientName"
                  readOnly
                  value={`${client.code.toUpperCase()} - ${client.name}`}
                />
              </div>

              <FormField
                control={form.control}
                name="contractFromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
                              format(field.value, DateFormat)
                            ) : (
                              <span>Pick a start date</span>
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

              <FormField
                control={form.control}
                name="contractToDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                              format(field.value, DateFormat)
                            ) : (
                              <span>Pick an end date</span>
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
              <AlertDialogFooter className="pt-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Renew Contract</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        ) : (
          <div className="flex justify-center items-center gap-2 py-24">
            <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
            Fetching client information, please wait ...
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogFormRenewClient;
