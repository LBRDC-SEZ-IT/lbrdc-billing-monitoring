import { Payroll } from "@/interfaces/payroll";
import { subscribeToPayroll } from "@/services/payrollService";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const TablePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPayroll((data) => {
      setPayrolls(data);
    });

    return () => unsubscribe();
  }, []);

  return (
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
        {payrolls.map((payroll) => (
          <TableRow key={payroll.id}>
            <TableCell>{payroll.id}</TableCell>
            <TableCell>{payroll.client}</TableCell>
            <TableCell>{payroll.date}</TableCell>
            <TableCell>
              <Badge variant={"outline"}>{payroll.status}</Badge>
            </TableCell>
            <TableCell>{payroll.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePayroll;
