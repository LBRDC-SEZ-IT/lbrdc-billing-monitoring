"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { api } from "@/convex/_generated/api";
import { Outbound } from "@/interfaces/outbound";
import { outgoingAccountSchema } from "@/validators/add-outgoing-account";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "./icons";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Props {
  className?: string;
}

const FormAddAccountOutbound = ({ className, ...props }: Props) => {
  const { user } = useUser();
  const createOutgoingAccount = useMutation(api.outbound.create);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const stepHeights = [100, 400, 520];

  const form = useForm<z.infer<typeof outgoingAccountSchema>>({
    resolver: zodResolver(outgoingAccountSchema),
    defaultValues: {
      client: "",
      group: "",
      subgroup: "",
      categories: [{ name: "", amount: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const clients = useQuery(api.clients.get);
  const watchClient = form.watch("client");
  const watchGroup = form.watch("group");
  const watchPayables = form.watch("categories");
  let groups = useQuery(api.groups.getByRef, { refID: watchClient });
  let subgroups = useQuery(api.subgroups.getByRef, { refID: watchGroup });
  let totalPayableAmount = watchPayables.reduce((n, { amount }) => n + amount, 0);

  useEffect(() => {
    form.resetField("group");
    form.resetField("subgroup");
  }, [watchClient]);

  useEffect(() => {
    form.resetField("subgroup");
  }, [watchGroup]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      form.resetField("datePeriodFrom");
      form.resetField("datePeriodTo");
      setFormStep(0);
    }
  }, [isOpen]);

  const handleCloseDialog = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (isOpen) {
      if (form.formState.isDirty) {
        setShowConfirmClose(true);
      } else {
        setIsOpen(false);
      }
    }
  };

  const confirmCloseDialog = (confirm: boolean) => {
    if (confirm) {
      setIsOpen(false);
    }
    setShowConfirmClose(false);
  };

  const handleNextClick = async () => {
    if (formStep === 0) {
      const isTriggered = await form.trigger(["client"]);
      const clientState = form.getFieldState("client");

      if (!isTriggered || !clientState.isDirty || clientState.invalid) return;

      if (!groups) {
        toast("Something went wrong", {
          description: "Unable to get groups for this client. Please try again.",
        });
        return;
      }

      if (groups && groups.length < 1) {
        toast("Unable to continue", {
          description:
            "The selected client doesn't have any groups. Please create one before adding a new account.",
        });
        return;
      }
    }

    if (formStep === 1) {
      const isTriggered = await form.trigger(["datePeriodFrom", "datePeriodTo", "group"]);
      const groupState = form.getFieldState("group");
      const datePeriodFrom = form.getFieldState("datePeriodFrom");
      const datePeriodTo = form.getFieldState("datePeriodTo");

      if (!isTriggered || !groupState.isDirty || groupState.invalid) return;
      if (!isTriggered || !datePeriodFrom.isDirty || datePeriodFrom.invalid) return;
      if (!isTriggered || !datePeriodTo.isDirty || datePeriodTo.invalid) return;
    }

    setFormStep((prev) => prev + 1);
  };

  const handleBackClick = () => {
    setFormStep((prev) => prev - 1);
  };

  function onSubmit(data: z.infer<typeof outgoingAccountSchema>) {
    if (!user) {
      toast("Unable to continue", {
        description: "Can't retrieve user information. Please logout and login again",
      });
      return;
    }

    const clientInfo = clients?.find((values) => data.client === values._id);
    const startDateCode = format(new Date(data.datePeriodFrom), "MMdd");
    const endDateCode = format(new Date(data.datePeriodTo), "MMdd");
    const yearDateCode = format(new Date(data.datePeriodTo), "yyyy");
    const accountCode = `${clientInfo?.code.toUpperCase()}-${startDateCode}-${endDateCode}-${yearDateCode}`;

    try {
      const newAccount: Outbound = {
        code: accountCode,
        clientRefID: data.client,
        groupRefID: data.group,
        subgroupRefID: data.subgroup,
        authorRefID: user.id,
        datePeriod: {
          from: data.datePeriodFrom.toISOString(),
          to: data.datePeriodTo.toISOString(),
        },
        totalAmount: totalPayableAmount,
        categories: data.categories,
        status: "Open",
        statusInfo: {
          userID: user.id,
          timestamp: Date.now().toString(),
        },
      };

      if (user.organizationMemberships[0].role === "org:manager_outbound") {
        newAccount.approvalInfo = {
          userID: user.id,
          timestamp: Date.now().toString(),
        };
      }

      createOutgoingAccount(newAccount).then(() => {
        toast("You have successfully added a new account!");
        setIsOpen(false);
      });
    } catch (error) {
      console.log("form-add-account-outbound.ts:onSubmit; ", error);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogTrigger asChild className={cn(className)} {...props}>
          <Button size={"sm"}>Add Record</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>
              Enter the details of the new account. (Step {formStep + 1})
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <motion.div
                initial={{ height: stepHeights[formStep] }}
                animate={{ height: stepHeights[formStep] }}>
                <AnimatePresence>
                  {formStep === 0 && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 space-y-3"
                      key="step-1"
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}>
                      <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <Select
                              name="client"
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}>
                              <FormControl>
                                <SelectTrigger disabled={clients === undefined}>
                                  <SelectValue
                                    placeholder={
                                      clients === undefined ? "Fetching clients" : "Select a client"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients?.map(({ _id, code, name }) => (
                                  <SelectItem key={_id} value={_id}>
                                    {code.toUpperCase()} - {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {formStep === 1 && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 space-y-2"
                      key="step-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}>
                      <FormField
                        control={form.control}
                        name="datePeriodFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Period</FormLabel>
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
                        name="datePeriodTo"
                        render={({ field }) => (
                          <FormItem>
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
                                      <span>Pick an end date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                  mode="single"
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
                        name="group"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select
                              name="group"
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}>
                              <FormControl>
                                <SelectTrigger disabled={groups === undefined}>
                                  <SelectValue
                                    placeholder={
                                      groups === undefined
                                        ? "Fetching groups"
                                        : groups && groups.length < 1
                                          ? "There are no groups available to this client."
                                          : "Select a group"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {groups?.map(({ _id, name }) => (
                                  <SelectItem key={_id} value={_id}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subgroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subgroup</FormLabel>
                            <div className="flex gap-2">
                              <Select
                                name="subgroup"
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}>
                                <FormControl>
                                  <SelectTrigger
                                    disabled={
                                      subgroups === undefined ||
                                      form.getValues("group") === "" ||
                                      subgroups.length < 1
                                    }>
                                    <SelectValue
                                      placeholder={
                                        subgroups === undefined
                                          ? "Fetching subgroups"
                                          : subgroups && subgroups.length < 1
                                            ? "There are no subgroup available for this group."
                                            : "Select a subgroup"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subgroups?.map(({ _id, name }) => (
                                    <SelectItem key={_id} value={_id}>
                                      {name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant={"outline"}
                                size={"icon"}
                                onClick={() => {
                                  form.resetField("subgroup");
                                }}>
                                <Icons.actionClear className="size-4 min-w-4 min-h-4" />
                              </Button>
                            </div>
                            <FormDescription>Subgroup is optional.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step-3"
                      className="space-y-2"
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}>
                      <Label htmlFor="scrollarea">List of Payable Items</Label>
                      <ScrollArea
                        id="scrollarea"
                        className="h-96 border border-dashed rounded-md py-2">
                        <div className="grid grid-cols-9 gap-2 px-4 sticky top-0 bg-background font-semibold">
                          <p className="col-span-4">Name</p>
                          <p>Amount</p>
                        </div>
                        {fields.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2 px-4 py-2">
                            <div className="grid grid-cols-9 gap-2">
                              <FormItem className="col-span-4">
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...form.register(`categories.${index}.name` as const, {
                                      required: true,
                                    })}
                                  />
                                </FormControl>
                              </FormItem>
                              <FormItem className="col-span-4">
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...form.register(`categories.${index}.amount` as const, {
                                      valueAsNumber: true,
                                    })}
                                  />
                                </FormControl>
                              </FormItem>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size={"icon"}
                                  onClick={() => {
                                    remove(index);
                                  }}>
                                  <Icons.actionDelete className="min-w-4 min-h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p
                              className={cn(
                                "text-red-500 text-sm",
                                !form.formState.errors.categories && "hidden"
                              )}>
                              {form.formState.errors.categories &&
                                `${form.formState.errors.categories[index]?.name?.message ?? ""} ${form.formState.errors.categories[index]?.amount?.message ?? ""}`}
                            </p>
                          </motion.div>
                        ))}
                      </ScrollArea>
                      <Button
                        type="button"
                        variant={"outline"}
                        className="w-full mb-4"
                        onClick={() => {
                          append({ name: "", amount: 0 });
                        }}>
                        Add Row
                      </Button>
                      {form.formState.errors.categories?.message ? (
                        <p className="text-red-500 text-center">
                          {form.formState.errors.categories?.message}
                        </p>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="">Total Amount</p>
                          <p className="font-medium text-primary">
                            {totalPayableAmount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <DialogFooter>
                <Button
                  type="button"
                  variant={"secondary"}
                  className={cn(![1, 2].includes(formStep) && "hidden")}
                  onClick={handleBackClick}>
                  Back
                </Button>
                <Button
                  type="button"
                  className={cn(![0, 1].includes(formStep) && "hidden")}
                  onClick={handleNextClick}>
                  Next
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.errors.categories?.message !== undefined}
                  className={cn(formStep !== 2 && "hidden")}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Close</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You have unsaved changes. Are you sure you want to dismiss adding an account?
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => confirmCloseDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => confirmCloseDialog(true)}>
              Yes, Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormAddAccountOutbound;
