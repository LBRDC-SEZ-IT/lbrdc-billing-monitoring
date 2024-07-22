import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { GroupView } from "@/interfaces/group";
import { Row } from "@tanstack/react-table";
import { useQuery } from "convex/react";

interface Props {
  row: Row<GroupView>;
}

const TableExpandedContent = ({ row }: Props) => {
  const subgroups = useQuery(api.subgroups.getByRef, { refID: row.original._id });
  return (
    <Card>
      <Table>
        <TableHeader className="border-b">
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!subgroups ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24">
                <div className="flex justify-center items-center gap-2">
                  <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
                  Fetching data, please wait ...
                </div>
              </TableCell>
            </TableRow>
          ) : subgroups.length > 0 ? (
            subgroups.map((subgroup, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{subgroup.name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="py-6">
                <div className="flex flex-col justify-center items-center">
                  <span className="text-lg font-semibold mb-1">No subgroup(s) yet</span>
                  <span className="max-w-lg text-muted-foreground text-pretty text-center">
                    You can add a new subgroup by clicking this group&apos;s row actions button.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TableExpandedContent;
