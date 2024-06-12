"use client";

import { Billing } from "@/interfaces/billing";
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

import { Payroll } from "@/interfaces/payroll";
import { addBilling } from "@/services/billingService";
import { updatePayroll } from "@/services/payrollService";
import { useState } from "react";
import { Icons } from "./icons";

const AddBilling = ({ payroll }: { payroll: Payroll }) => {
  const [client, setClient] = useState<string | null>(null);
  const [amountToBill, setAmountToBill] = useState<number | string>("");

  const handleAddBilling = async () => {
    if (amountToBill && payroll.id) {
      const newBilling: Billing = {
        client: payroll.client,
        dateOfPeriod: payroll.date,
        type: amountToBill === payroll.amount ? "Full Bill" : "Partial Bill",
        payrollAmount: payroll.amount,
        amountBilled: Number(amountToBill),
        amountCollected: 0,
        dateOfCollection: "N/A",
      };

      await addBilling(newBilling);
      await updatePayroll(payroll.id, { status: "Billed" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Icons.actionBill className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Billing</DialogTitle>
          <DialogDescription>
            Add new billing for <span className="text-white font-medium">{payroll.client}</span>
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Payroll Date Period" readOnly value={payroll.date}></Input>
        <Input placeholder="Payroll Amount" readOnly value={payroll.amount}></Input>
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

export default AddBilling;
