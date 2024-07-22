import DialogConfirmation from "@/components/dialog-confirmation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BillingWithCollectionRemarks } from "@/interfaces/billing";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SheetMoreInfo from "./sheet-more-info";

interface Props {
  row: Row<BillingWithCollectionRemarks>;
}

const ActionBilling = ({ row }: Props) => {
  const [currentRowID, setCurrentRowID] = useState("");

  useMemo(() => {
    setCurrentRowID(row.original._id!);
  }, []);

  const removeByID = useMutation(api.billings.remove);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasCollections = row.original.collections?.length || 0;

  const handleViewRemarksClick = () => {
    setIsSheetOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (currentRowID) {
        const response = await removeByID({ id: currentRowID as Id<"billings"> });

        if (response.success) {
          toast.success("You have successfully deleted the billing.");
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
          <DropdownMenuItem onClick={handleViewRemarksClick}>
            <Icons.actionInformation className="min-w-4 min-h-4 size-4 mr-3" />
            Remarks
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(currentRowID || "");
              toast("Copied to clipboard.");
            }}>
            <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            disabled={hasCollections > 0}
            onClick={() => setIsDialogOpen(true)}>
            <Icons.actionDelete className="min-w-4 min-h-4 size-4 mr-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isSheetOpen && currentRowID !== "" && (
        <SheetMoreInfo ref_ID={currentRowID} onOpenChange={() => setIsSheetOpen(false)} />
      )}

      <DialogConfirmation
        isOpen={isDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this billing and remove the data from the server."
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ActionBilling;
