import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormat } from "@/config/global";
import { BillingWithCollection } from "@/interfaces/billing";
import { Row } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface Props {
  row: Row<BillingWithCollection>;
}

const SubRowCollections = ({ row }: Props) => {
  let totalCollections = 0;

  row.original.collections?.forEach((collection) => {
    totalCollections += collection.amount;
  });

  return (
    <Card>
      <Table className="table-fixed">
        <TableHeader className="border-b">
          <TableRow>
            <TableHead className="w-[150px]">ID</TableHead>
            <TableHead className="w-[150px]">OR Number</TableHead>
            <TableHead>Collection Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[90px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.original.collections?.map((collection, index) => (
            <TableRow key={index} className="py-2">
              <TableCell className="text-ellipsis overflow-hidden text-muted-foreground">
                {collection._id}
              </TableCell>
              <TableCell className="font-semibold text-ellipsis overflow-hidden">
                {collection.code}
              </TableCell>
              <TableCell>{format(parseISO(collection.timestamp), DateFormat)}</TableCell>
              <TableCell className="text-right text-emerald-500">
                {collection.amount.toLocaleString("en-us", {
                  currency: "PHP",
                  style: "currency",
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <Icons.actions className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-36">
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(collection._id ?? "");
                        toast("Copied to clipboard.");
                      }}>
                      <Icons.actionClipboardCopy className="min-w-4 min-h-4 size-4 mr-3" />
                      Copy Collection ID
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Amount</TableCell>
            <TableCell className="text-right">
              {totalCollections.toLocaleString("en-us", {
                currency: "PHP",
                style: "currency",
              })}
            </TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </Card>
  );
};

export default SubRowCollections;
