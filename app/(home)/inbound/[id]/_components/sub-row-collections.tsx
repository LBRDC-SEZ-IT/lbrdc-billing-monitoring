import DialogConfirmation from "@/components/dialog-confirmation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToMoney, DateFormat } from "@/config/global";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BillingWithCollectionRemarks } from "@/interfaces/billing";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import SheetMoreInfo from "./sheet-more-info";

interface Props {
  row: Row<BillingWithCollectionRemarks>;
}

const SubRowCollections = ({ row }: Props) => {
  const removeByID = useMutation(api.collection.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRowID, setCurrentRowID] = useState("");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [collectionID, setCollectionID] = useState("");

  const handleViewRemarksClick = (id: string) => {
    setCollectionID(id);
    setIsSheetOpen(true);
  };

  const onDeleteClick = (id: string) => {
    setCurrentRowID(id);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (currentRowID) {
        const response = await removeByID({ id: currentRowID as Id<"collections"> });

        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }

        setCurrentRowID("");
      }
    } catch (err) {
      console.log("action-billing:handleDelete; ", err);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <Table className="table-fixed">
          <TableHeader className="border-b">
            <TableRow>
              <TableHead className="w-[150px]">OR Number</TableHead>
              <TableHead className="w-[150px]">Collection Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right w-[200px]">Amount</TableHead>
              <TableHead className="w-[90px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {row.original.collections && row.original.collections.length > 0 ? (
              row.original.collections.map((collection, index) => (
                <TableRow key={index} className="[&>*]:py-2">
                  <TableCell className="font-semibold text-ellipsis overflow-hidden">
                    {collection.code}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(parseISO(collection.timestamp), DateFormat)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Input
                      readOnly
                      className="h-9"
                      value={collection.remarks.map((remark) => remark.description).join(", ")}
                    />
                  </TableCell>
                  <TableCell className="text-right text-emerald-500">
                    {convertToMoney(collection.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <Icons.actions className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuItem>
                          <Icons.actionEdit className="min-w-4 min-h-4 size-4 mr-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewRemarksClick(collection._id!)}>
                          <Icons.actionInformation className="min-w-4 min-h-4 size-4 mr-3" />
                          Remarks
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(collection._id ?? "");
                            toast("Copied to clipboard.");
                          }}>
                          <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => onDeleteClick(collection._id!)}>
                          <Icons.actionDelete className="min-w-4 min-h-4 size-4 mr-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-lg font-semibold mb-1">No collections yet</span>
                    <span className="max-w-lg text-muted-foreground text-pretty text-center">
                      You can add collection by clicking the &#34;Add Collection&#34; button for
                      this billing.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {isSheetOpen && (
        <SheetMoreInfo ref_ID={collectionID} onOpenChange={() => setIsSheetOpen(false)} />
      )}

      <DialogConfirmation
        isOpen={isDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this collection and remove the data from the server."
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => handleDelete()}
      />
    </>
  );
};

export default SubRowCollections;
