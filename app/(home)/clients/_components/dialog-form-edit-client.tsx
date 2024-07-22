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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DateFormat } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    code: z.string().min(1, "Please enter the client's code."),
    name: z.string().min(1, "Please enter the client's name."),
    description: z
      .string()
      .max(300, "Description must not be longer than 300 characters.")
      .optional(),
    contractFromDate: z.date({ required_error: "Please select a start date." }),
    contractToDate: z.date({ required_error: "Please select an end date." }),
  })
  .refine((data) => data.contractToDate >= data.contractFromDate, {
    message: "End date cannot be before start date.",
    path: ["contractToDate"],
  });

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientID: string;
}

const DialogFormEditClient = ({ clientID, ...props }: Props) => {
  const updateClient = useMutation(api.clients.update);
  const clients = useQuery(api.clients.get, { client_id: clientID });
  const client = clients && clients[0];

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { reset } = form;

  useEffect(() => {
    if (client) {
      const contract = client.contracts.find((f) => f.status === "Active");
      const fromDate = contract?.from_date;
      const toDate = contract?.to_date;
      reset({
        code: client.code.toUpperCase(),
        name: client.name,
        description: client.description,
        contractFromDate: fromDate ? parseISO(fromDate) : new Date(),
        contractToDate: toDate ? parseISO(toDate) : new Date(),
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await updateClient({
      id: clientID as Id<"clients">,
      code: data.code,
      name: data.name,
      description: data.description,
      contract_info: {
        status: "Active",
        from_date: data.contractFromDate.toISOString(),
        to_date: data.contractToDate.toISOString(),
        timestamp: new Date().toISOString(),
      },
    });

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    props.setIsOpen(false);
  };

  useEffect(() => {
    form.reset();
  }, [props.isOpen]);

  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Client</AlertDialogTitle>
          <AlertDialogDescription>Enter new details for this client.</AlertDialogDescription>
        </AlertDialogHeader>
        {client ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter client code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-48"
                        placeholder="Enter client description (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <AlertDialogFooter className="pt-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Update</Button>
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

export default DialogFormEditClient;
