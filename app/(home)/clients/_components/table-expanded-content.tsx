import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateRange, formatTimestamp } from "@/config/global";
import { ClientStatuses } from "@/constants/client-statuses";
import { Client } from "@/interfaces/client";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";

interface Props {
  row: Row<Client>;
}

const TableExpandedContent = ({ row }: Props) => {
  return (
    <Card>
      <Table>
        <TableHeader className="border-b">
          <TableRow>
            <TableHead className="w-[30px]">No.</TableHead>
            <TableHead>Contract Date</TableHead>
            <TableHead className="w-[210px]">Status</TableHead>
            <TableHead className="w-[350px]">Date & Time Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.original.contracts.map((contract, index) => (
            <TableRow key={index} className="[&>*]:py-3">
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {formatDateRange({ from: contract.from_date, to: contract.to_date })}
              </TableCell>
              <TableCell>
                {contract.status === "Active" &&
                new Date().setHours(0, 0, 0, 0) >
                  new Date(contract.to_date).setHours(0, 0, 0, 0) ? (
                  <p
                    className={cn(
                      "w-fit px-2 py-1 rounded-full",
                      ClientStatuses.find((f) => f.value === "End of Contract")?.bgColor,
                      ClientStatuses.find((f) => f.value === "End of Contract")?.textColor
                    )}>
                    Contract Ended
                  </p>
                ) : (
                  <p
                    className={cn(
                      "w-fit px-2 py-1 rounded-full",
                      ClientStatuses.find((f) => f.value === contract.status)?.bgColor,
                      ClientStatuses.find((f) => f.value === contract.status)?.textColor
                    )}>
                    {contract.status}
                  </p>
                )}
              </TableCell>
              <TableCell>
                {formatTimestamp(contract.timestamp, "Date")} •{" "}
                {formatTimestamp(contract.timestamp, "Time")}{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TableExpandedContent;
