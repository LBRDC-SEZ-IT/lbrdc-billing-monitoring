"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Please enter the group name."),
  client: z.string().min(1, "Please select a client."),
});

const DialogFormAddGroup = () => {
  const clients = useQuery(api.clients.get, {});
  const createGroup = useMutation(api.groups.create);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      client: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await createGroup({
      name: data.name,
      client_ref_ID: data.client,
    });

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  return (
    <>
      <Button
        tooltip="Add new Group"
        size={"sm"}
        className="ml-auto"
        onClick={() => setIsOpen(true)}>
        Add Group
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Group</AlertDialogTitle>
            <AlertDialogDescription>
              Enter complete information of the new group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <AlertDialogFooter className="pt-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Add Group</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DialogFormAddGroup;
