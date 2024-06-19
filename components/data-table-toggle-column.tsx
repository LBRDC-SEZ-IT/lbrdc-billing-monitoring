import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DataTableToggleColumnProps<TData> {
  table: Table<TData>;
  className?: string;
}

export default function DataTableToggleColumn<TData>({
  table,
  className,
  ...props
}: DataTableToggleColumnProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn(className)} {...props}>
        <Button size={"icon"} variant="outline" className="h-9 w-9">
          <Icons.settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
