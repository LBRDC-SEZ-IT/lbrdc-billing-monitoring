"use client";

import { useEffect, useState } from "react";
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

import { Client } from "@/interfaces/client";
import { subscribeToClients } from "@/services/clientService";

const AddPayroll = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToClients((clientsData) => {
      setClients(clientsData);
    });

    return () => unsubscribe();
  }, []);

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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clients</SelectLabel>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.code} - {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input placeholder="Amount"></Input>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayroll;
