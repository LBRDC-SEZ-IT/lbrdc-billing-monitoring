"use client";

import { Icons } from "@/components/icons";
import SheetOutboundAccount from "@/components/sheet-outbound-account";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";
import { OutboundView } from "@/interfaces/outbound";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import DialogFormAddAccountInbound from "./dialog-form-add-account-inbound";

interface ActionCellProps {
  row: Row<OutboundView>;
}

export const ActionCellOutbound = ({ row }: ActionCellProps) => {
  const rowData = row.original;
  const [accountID, setAccountID] = useState<Id<"outboundAccounts">>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogAddOpen, setIsDialogAddOpen] = useState(false);
  const [dataRow, setDataRow] = useState<Row<OutboundView>>();

  const handleView = () => {
    if (rowData._id) {
      setAccountID(rowData._id as Id<"outboundAccounts">);
      setIsSheetOpen(true);
    }
  };

  const handleAdd = () => {
    if (row) {
      setAccountID(rowData._id as Id<"outboundAccounts">);
      setDataRow(row);
      setIsDialogAddOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <SheetOutboundAccount open={isSheetOpen} setOpen={setIsSheetOpen} outboundID={accountID!} />
      <DialogFormAddAccountInbound
        open={isDialogAddOpen}
        setOpen={setIsDialogAddOpen}
        row={dataRow!}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Icons.actions className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={handleView}>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAdd}>
            <Icons.actionBill className="min-w-4 min-h-4 size-4 mr-3" />
            Add Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
