"use client";

import Loader from "@/components/loader";
import NoData from "@/components/no-data";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Please enter the group name."),
  client: z.string().min(1, "Please select a client."),
});

interface Props {
  groupID: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DialogFormEditGroup = ({ groupID, ...props }: Props) => {
  const updateGroup = useMutation(api.groups.update);
  const clients = useQuery(api.clients.get, {});
  const group = useQuery(api.groups.getByID, { group_ID: groupID });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      client: "",
      name: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (group) {
      reset({
        client: group.client_ref_ID,
        name: group.name,
      });
    }
  }, [group, reset]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await updateGroup({
      group_ID: groupID,
      client_ref_ID: data.client,
      name: data.name,
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
          <AlertDialogTitle>Edit Group</AlertDialogTitle>
          <AlertDialogDescription>Enter new details for this group.</AlertDialogDescription>
        </AlertDialogHeader>
        {group === undefined ? (
          <Loader />
        ) : group !== null ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={group.name} {...field} />
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
                      name={field.name}
                      defaultValue={field.value}
                      onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger disabled={clients === undefined}>
                          <SelectValue
                            placeholder={
                              clients === undefined
                                ? "Fetching clients"
                                : clients?.find((f) => f._id === field.value)?.name ?? ""
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem
                            key={client._id}
                            value={client._id}
                            onSelect={() => form.setValue("client", client._id)}>
                            {client.name}
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
                <Button type="submit">Update</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        ) : (
          <NoData />
        )}

        {!group && (
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogFormEditGroup;
