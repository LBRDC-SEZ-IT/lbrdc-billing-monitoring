"use client";

import { useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

import { CurrentUserFirstName, CurrentUserID, CurrentUserLastName } from "@/config/user";
import { InboundAccount } from "@/interfaces/inbound";
import { OutboundAccount } from "@/interfaces/outbound";
import { addInboundAccount } from "@/services/InboundAccountsService";
import { updateOutboundAccount } from "@/services/OutboundAccountsService";
import { Timestamp } from "firebase/firestore";

interface Props {
  outboundAccount: OutboundAccount;
}

const DialogAddAccountInbound = ({ outboundAccount }: Props) => {
  const [amountToBill, setAmountToBill] = useState<number | string>("");

  const handleAddBilling = async () => {
    if (amountToBill && outboundAccount.docID) {
      const newBilling: InboundAccount = {
        clientDocID: outboundAccount.clientDocID,
        developmentDocID: outboundAccount.developmentDocID,
        dateOfPeriod: outboundAccount.datePeriod,
        status: amountToBill === outboundAccount.totalAmount ? "Full Bill" : "Partial Bill",
        outboundAmount: outboundAccount.totalAmount,
        amountBilled: Number(amountToBill),
        amountCollected: 0,
        dateOfCollection: "N/A",
      };

      await addInboundAccount(newBilling);
      await updateOutboundAccount(outboundAccount.docID, {
        status: "Completed",
        statusUpdatedBy: {
          userID: CurrentUserID,
          userFirstName: CurrentUserFirstName,
          userLastName: CurrentUserLastName,
          timestamp: Timestamp.now(),
        },
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Icons.actionBill className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Billing</DialogTitle>
          <DialogDescription>
            Add new billing for{" "}
            <span className="text-foreground font-medium">{outboundAccount.clientDocID}</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Payroll Date Period"
          readOnly
          value={outboundAccount.datePeriod}></Input>
        <Input placeholder="Payroll Amount" readOnly value={outboundAccount.totalAmount}></Input>
        <Input
          placeholder="Amount to Bill"
          value={amountToBill}
          onChange={(e) => setAmountToBill(e.target.value)}></Input>
        <DialogFooter>
          <Button type="submit" onClick={handleAddBilling}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddAccountInbound;
