"use client";

import AddPayroll from "@/components/add-payroll";
import TablePayroll from "@/components/table-payroll";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const payrolls = [
    {
      id: "PAYROLL1",
      client: "Department of Finance",
      date: "Jun 1 - Jun 15, 2024",
      status: "billed",
      amount: "₱1,000.00",
    },
    {
      id: "PAYROLL2",
      client: "Staff House Finance Corporation",
      date: "Jun 1 - Jun 15, 2024",
      status: "open for billing",
      amount: "₱2,000.00",
    },
  ];

  const openPayrolls = payrolls.filter((p) => p.status === "open for billing");

  const billings = [
    {
      id: "BILLING1",
      client: "Department of Finance",
      date: "Jun 1 - Jun 15, 2024",
      status: "matched",
      amount: "₱1,000.00",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-between p-24 space-y-12">
      <ThemeToggle />
      <div className="container">
        <div className="flex justify-between">
          <h2>Payroll Table</h2>
          <AddPayroll />
        </div>
        <TablePayroll />
      </div>

      <div className="container">
        <div className="flex justify-between">
          <h2>Billing Table</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"}>Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Billing</DialogTitle>
                <DialogDescription>Add new billing</DialogDescription>
              </DialogHeader>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select item to bill" />
                </SelectTrigger>
                <SelectContent>
                  {openPayrolls.map((payroll, index) => (
                    <SelectItem key={index} value={payroll.id}>
                      {payroll.id} - {payroll.client}: {payroll.date} ({payroll.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Amount"></Input>
              <DialogFooter>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billings.map((billing, index) => (
              <TableRow key={index}>
                <TableCell>{billing.id}</TableCell>
                <TableCell>{billing.client}</TableCell>
                <TableCell>{billing.date}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{billing.status}</Badge>
                </TableCell>
                <TableCell>{billing.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
