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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Please enter a subgroup name."),
});

interface Props {
  groupID: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DialogFormAddSubgroup = ({ groupID, ...props }: Props) => {
  const createSubgroup = useMutation(api.subgroups.create);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await createSubgroup({
      name: data.name,
      group_ref_ID: groupID as Id<"groups">,
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
  }, [props.isOpen, form]);

  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Subgroup</AlertDialogTitle>
          <AlertDialogDescription>Enter details for the new subgroup.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subgroup Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter subgroup name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="pt-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">Add Subgroup</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogFormAddSubgroup;
