"use client";

import { Client } from "@/interfaces/client";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Payroll } from "@/interfaces/payroll";
import { getClients } from "@/services/clientService";
import { addPayroll } from "@/services/payrollService";
import { useState } from "react";

const AddPayroll = () => {
  const { clients, loading } = getClients();
  const [client, setClient] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | string>("");

  const handleAddPayroll = async () => {
    if (client && amount) {
      const newPayroll: Payroll = {
        client: client,
        amount: Number(amount),
        date: "Jun 1 - 15, 2024",
        status: "Open For Billing",
      };

      await addPayroll(newPayroll);

      setClient(null);
      setAmount("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payroll</DialogTitle>
          <DialogDescription>Add new payroll</DialogDescription>
        </DialogHeader>
        <Select onValueChange={setClient}>
          <SelectTrigger disabled={loading}>
            <SelectValue placeholder={loading ? "Fetching clients" : "Select a client"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clients</SelectLabel>
              {clients.map((client: Client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.code} - {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}></Input>
        <DialogFooter>
          <Button type="submit" onClick={handleAddPayroll}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayroll;
