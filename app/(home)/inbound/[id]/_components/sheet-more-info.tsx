import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatTimestamp } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  remarks: z.string().max(300, {
    message: "Remarks must not be longer than 300 characters.",
  }),
});

interface Props {
  ref_ID: string;
  onOpenChange: () => void;
}

const SheetMoreInfo = ({ ref_ID, onOpenChange }: Props) => {
  const remarks = useQuery(api.descriptions.getByRef, { ref_ID: ref_ID, type: "REMARKS" });
  const createRemarks = useMutation(api.descriptions.create);
  const removeRemark = useMutation(api.descriptions.remove);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      remarks: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (data.remarks !== "") {
      createRemarks({
        ref_ID: ref_ID,
        type: "REMARKS",
        description: data.remarks,
      });

      toast("You have successfully added a remarks for this billing!");
      form.reset();
    }
  };

  const handleRemoveClick = async (id: string) => {
    if (id) {
      removeRemark({
        ID: id as Id<"descriptions">,
      });

      toast("You have successfully deleted the remark.");
    }
  };

  return (
    <Sheet open={true} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>More Info</SheetTitle>
          <SheetDescription>Information/remarks of the selected item.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4">
          {remarks === undefined ? (
            <div className="flex justify-center items-center gap-2 text-sm h-full">
              <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
              Loading information, please wait ...
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea {...field} placeholder="Type remarks here ..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size={"sm"} className="ml-auto">
                    Save
                  </Button>
                </form>
              </Form>

              <div className="space-y-2">
                <h2 className="font-semibold">Remarks</h2>
                {remarks.length > 0 ? (
                  remarks.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-2 group relative">
                        <p className="text-pretty">{item.description}</p>
                        <p className="uppercase text-xs font-semibold text-muted-foreground">
                          {formatTimestamp(item._creationTime.toString(), "Date")} •{" "}
                          {formatTimestamp(item._creationTime.toString(), "Time")}
                        </p>
                        <Dialog>
                          <DialogTrigger className="hidden group-hover:flex absolute top-0 right-2">
                            <Button
                              className="rounded-full hover:text-red-500 hover:bg-red-100"
                              size={"icon"}
                              variant={"secondary"}
                              onClick={() => {
                                console.log(item._id);
                              }}>
                              <Icons.actionDelete className="min-w-4 max-w-4 size-4" />
                            </Button>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this remark?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button type="button" variant="secondary">
                                  No
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRemoveClick(item._id)}>
                                  Yes, Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </DialogTrigger>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 ">
                      <div className="space-y-4 text-center flex flex-col">
                        <div className="flex justify-center">
                          <div className="bg-accent p-3 rounded-full w-fit">
                            <Icons.illustration.noRemarks className="min-w-6 min-h-6 size-6" />
                          </div>
                        </div>
                        <p className="text-sm">Add remarks here by typing above and saving it.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button className="w-full" onClick={() => onOpenChange()}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMoreInfo;
