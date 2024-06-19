"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

import {
  CurrentUserFirstName,
  CurrentUserID,
  CurrentUserLastName,
  CurrentUserRoleType,
} from "@/config/user";
import { Development } from "@/interfaces/development";
import { Location } from "@/interfaces/location";
import { OutboundAccount } from "@/interfaces/outbound";
import { addOutboundAccount } from "@/services/OutboundAccountsService";
import { getClients } from "@/services/clientService";
import { getDevelopments } from "@/services/developmentService";
import { getLocations } from "@/services/locationService";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface Props {
  className?: string;
}

const DialogAddAccountOutbound = ({ className, ...props }: Props) => {
  const { clients, clientsLoading } = getClients();
  const [clientDocID, setClientDocID] = useState<string>("");

  const { developments, developmentsLoading } = getDevelopments();
  const [developmentDocID, setDevelopmentDocID] = useState<string>("");

  const locations = getLocations();
  const [locationDocID, setLocationDocID] = useState<string>("");

  const [date, setDate] = React.useState<DateRange | undefined>();
  const [amount, setAmount] = useState<number | string>("");
  const [code, setCode] = useState("");

  const formattedDate = date?.from
    ? date.to
      ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
      : `${format(date.from, "LLL dd, y")}`
    : null;

  const handleAddPayroll = async () => {
    if (clientDocID && developmentDocID && amount && formattedDate) {
      const newAccount: OutboundAccount = {
        code: code,
        clientDocID: clientDocID,
        developmentDocID: developmentDocID,
        locationDocID: locationDocID,
        datePeriod: formattedDate,
        totalAmount: Number(amount), // Add all of the amount of payableCategories
        payableCategories: [{ name: "Regular Payroll", amount: 1000 }],
        status: CurrentUserRoleType === "Manager" ? "Open" : "Approval",
        statusUpdatedBy: {
          userID: CurrentUserID,
          userFirstName: CurrentUserFirstName,
          userLastName: CurrentUserLastName,
          timestamp: Timestamp.now(),
        },
        createdBy: {
          userID: CurrentUserID,
          userFirstName: CurrentUserFirstName,
          userLastName: CurrentUserLastName,
          timestamp: Timestamp.now(),
        },
      };

      if (CurrentUserRoleType === "Manager") {
        newAccount.approvedBy = {
          userID: CurrentUserID,
          userFirstName: CurrentUserFirstName,
          userLastName: CurrentUserLastName,
          timestamp: Timestamp.now(),
        };
      }

      await addOutboundAccount(newAccount);

      setClientDocID("");
      setDevelopmentDocID("");
      setLocationDocID("");
      setDate(undefined);
      setAmount("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className={cn(className)} {...props}>
        <Button size={"sm"}>Add Record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payable Account</DialogTitle>
          <DialogDescription>Enter the details of the new payable account.</DialogDescription>
        </DialogHeader>

        <Select onValueChange={setClientDocID}>
          <SelectTrigger disabled={clientsLoading}>
            <SelectValue placeholder={clientsLoading ? "Fetching clients" : "Select a client"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clients</SelectLabel>
              {clients.map((client: Client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.code} - {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setDevelopmentDocID}>
          <SelectTrigger disabled={developmentsLoading}>
            <SelectValue
              placeholder={developmentsLoading ? "Fetching developments" : "Select a development"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Developments</SelectLabel>
              {developments.map((development: Development) => (
                <SelectItem key={development.id} value={development.id}>
                  {development.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setLocationDocID}>
          <SelectTrigger disabled={locations.loading}>
            <SelectValue
              placeholder={locations.loading ? "Fetching locations" : "Select a location"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Developments</SelectLabel>
              {locations.items.map((location: Location) => (
                <SelectItem key={location.docID} value={location.docID}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDate ?? "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />

        <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <DialogFooter>
          <Button type="submit" onClick={handleAddPayroll}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddAccountOutbound;
