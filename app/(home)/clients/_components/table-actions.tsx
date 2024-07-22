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
import DialogFormEditClient from "./dialog-form-edit-client";
import DialogFormRenewClient from "./dialog-form-renew-client";

interface Props {
  row_id: string;
}

const TableActions = ({ row_id }: Props) => {
  const [currentRowID, setCurrentRowID] = useState("");

  const removeClient = useMutation(api.clients.remove);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);

  useEffect(() => {
    setCurrentRowID(isDeleteOpen ? row_id : "");
  }, [isDeleteOpen]);

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    const response = await removeClient({ clientId: currentRowID });
    if (response.success) {
      toast.success(response.message);
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
          <DropdownMenuItem onClick={handleEdit}>
            <Icons.actionEdit className="min-w-4 min-h-4 size-4 mr-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenewOpen(true)}>
            <Icons.actionRenew className="min-w-4 min-h-4 size-4 mr-3" />
            Renew
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

      <DialogFormEditClient isOpen={isEditOpen} setIsOpen={setIsEditOpen} clientID={row_id} />

      <DialogFormRenewClient isOpen={isRenewOpen} setIsOpen={setIsRenewOpen} clientID={row_id} />
    </>
  );
};

export default TableActions;
