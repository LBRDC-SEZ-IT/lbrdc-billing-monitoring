"use client";

import { Icons } from "@/components/icons";
import SheetOutboundAccount from "@/components/sheet-outbound-account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { OutboundView } from "@/interfaces/outbound";
import { useUser } from "@clerk/clerk-react";
import { Row } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionCellProps {
  row: Row<OutboundView>;
}

export const ActionCell = ({ row }: ActionCellProps) => {
  const updateStatus = useMutation(api.outbound.updateStatus);
  const userID = useQuery(api.users.getID);
  const { user } = useUser();

  const rowData = row.original;
  const permissions = user?.organizationMemberships[0].permissions;
  const canCancelAccount = permissions?.includes("org:cancel:outbound_account");
  const isOpen = rowData.status === "Open";
  const showCancel = isOpen && canCancelAccount;
  const [isAlertCancelOpen, setIsAlertCancelOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCancel = () => {
    if (rowData._id) {
      updateStatus({
        id: rowData._id as Id<"outboundAccounts">,
        userID: userID as Id<"users">,
        status: "Cancelled",
      });

      setIsAlertCancelOpen(false);
      toast("Successfully cancelled an account");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Dialog open={isAlertCancelOpen} onOpenChange={setIsAlertCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancel</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAlertCancelOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SheetOutboundAccount open={isSheetOpen} setOpen={setIsSheetOpen} outboundID={rowData._id!} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Icons.actions className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
            <Icons.actionView className="min-w-4 min-h-4 size-4 mr-3" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(rowData._id ?? "");
              toast("Copied to clipboard.");
            }}>
            <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
            Copy ID
          </DropdownMenuItem>
          {showCancel && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAlertCancelOpen(true)} className="text-red-500">
                <Icons.actionReject className="min-w-4 min-h-4 size-4 mr-3" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
