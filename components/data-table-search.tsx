import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
}

export default function DataTableSearch<TData>({ table }: DataTableSearchProps<TData>) {
  const filterableColumn =
    table.getAllColumns().find((column) => column.columnDef.enableColumnFilter) ||
    table.getAllColumns()[0];

  return (
    <Input
      placeholder="Search ..."
      value={(filterableColumn.getFilterValue() as string) ?? ""}
      onChange={(event) => filterableColumn.setFilterValue(event.target.value)}
      className="max-w-xs px-4 h-9"
    />
  );
}
