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
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DialogFormAddSubgroup from "./dialog-form-add-subgroup";
import DialogFormEditGroup from "./dialog-form-edit-group";

interface Props {
  row_id: string;
}

const TableActions = ({ row_id }: Props) => {
  const [currentRowID, setCurrentRowID] = useState("");
  const removeGroup = useMutation(api.groups.remove);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (isAddOpen || isEditOpen || isDeleteOpen) {
      setCurrentRowID(row_id);
    } else {
      setCurrentRowID("");
    }
  }, [isAddOpen, isEditOpen, isDeleteOpen]);

  const handleDelete = async () => {
    const response = await removeGroup({ group_ID: currentRowID });
    if (response.success) {
      toast.success(response.message);
      setCurrentRowID("");
    } else {
      toast.error(response.message);
    }
    setIsDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button tooltip="Actions" variant={"ghost"} size={"icon"}>
            <Icons.actions className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Icons.actionEdit className="min-w-4 min-h-4 size-4 mr-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAddOpen(true)}>
            <Icons.actionAdd className="min-w-4 min-h-4 size-4 mr-3" />
            Add subgroup
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => setIsDeleteOpen(true)}>
            <Icons.actionDelete className="min-w-4 min-h-4 size-4 mr-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogConfirmation
        isOpen={isDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this client and remove the data from the server."
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      {isEditOpen && (
        <DialogFormEditGroup groupID={currentRowID} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
      )}

      <DialogFormAddSubgroup groupID={currentRowID} isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </>
  );
};

export default TableActions;
