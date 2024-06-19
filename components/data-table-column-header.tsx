import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { AlignType, SortType } from "@/types";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  type: SortType;
  align: AlignType;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  type,
  align,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-2",
        className,
        align === "end" && "flex justify-end -mr-3"
      )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 data-[state=open]:bg-accent", align === "start" && "-ml-3")}>
            <span>{title}</span>
            {type === "Text" ? (
              column.getIsSorted() === "desc" ? (
                <Icons.sortDescText className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <Icons.sortAscText className="ml-2 h-4 w-4" />
              ) : (
                <Icons.sort className="ml-2 h-4 w-4" />
              )
            ) : type === "Number" ? (
              column.getIsSorted() === "desc" ? (
                <Icons.sortDescNumber className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <Icons.sortAscNumber className="ml-2 h-4 w-4" />
              ) : (
                <Icons.sort className="ml-2 h-4 w-4" />
              )
            ) : type === "Date" ? (
              column.getIsSorted() === "desc" ? (
                <Icons.sortDescNumber className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <Icons.sortAscNumber className="ml-2 h-4 w-4" />
              ) : (
                <Icons.sort className="ml-2 h-4 w-4" />
              )
            ) : column.getIsSorted() === "desc" ? (
              <Icons.sortDescDef className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <Icons.sortAscDef className="ml-2 h-4 w-4" />
            ) : (
              <Icons.sort className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            {type === "Text" ? (
              <>
                <Icons.sortAscText className="mr-2 size-4 text-muted-foreground/70" />A to Z
              </>
            ) : type === "Number" ? (
              <>
                <Icons.sortAscNumber className="mr-2 size-4 text-muted-foreground/70" />
                Low to High
              </>
            ) : type === "Date" ? (
              <>
                <Icons.sortAscNumber className="mr-2 size-4 text-muted-foreground/70" />
                Oldest to Newest
              </>
            ) : (
              <>
                <Icons.sortAscDef className="mr-2 size-4 text-muted-foreground/70" />
                Asc
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            {type === "Text" ? (
              <>
                <Icons.sortDescText className="mr-2 size-4 text-muted-foreground/70" />Z to A
              </>
            ) : type === "Number" ? (
              <>
                <Icons.sortDescNumber className="mr-2 size-4 text-muted-foreground/70" />
                High to Low
              </>
            ) : type === "Date" ? (
              <>
                <Icons.sortDescNumber className="mr-2 size-4 text-muted-foreground/70" />
                Newest to Oldest
              </>
            ) : (
              <>
                <Icons.sortDescDef className="mr-2 size-4 text-muted-foreground/70" />
                Desc
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className={cn(!column.getCanHide() && "hidden")} />
          <DropdownMenuItem
            className={cn(!column.getCanHide() && "hidden")}
            onClick={() => column.toggleVisibility(false)}>
            <Icons.hide className="mr-2 size-4 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
