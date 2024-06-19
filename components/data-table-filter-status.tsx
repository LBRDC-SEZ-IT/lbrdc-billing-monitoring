import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  OutboundAccountView,
  OutboundStatusModel,
  OutboundStatusTypes,
  OutboundStatuses,
} from "@/interfaces/outbound";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

interface DataTableFilterStatusProps<TData> {
  table: Table<TData>;
  data: OutboundAccountView[];
  excludedStatuses?: OutboundStatusTypes[];
}

export default function DataTableFilterStatus<TData>({
  table,
  data,
  excludedStatuses,
}: DataTableFilterStatusProps<TData>) {
  const [open, setOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<OutboundStatusModel[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  const statusCounts = useMemo(() => {
    const rows = data;

    const openCount = rows.filter((row) => row.status === "Open").length;
    const approvalCount = rows.filter((row) => row.status === "Approval").length;
    const rejectedCount = rows.filter((row) => row.status === "Rejected").length;
    const cancelledCount = rows.filter((row) => row.status === "Cancelled").length;
    const completedCount = rows.filter((row) => row.status === "Completed").length;

    return [
      { value: "Open", count: openCount },
      { value: "Approval", count: approvalCount },
      { value: "Rejected", count: rejectedCount },
      { value: "Completed", count: completedCount },
      { value: "Cancelled", count: cancelledCount },
    ];
  }, [table.getRowModel().rows]);

  const filteredStatuses = excludedStatuses
    ? OutboundStatuses.filter((status) => !excludedStatuses.includes(status.value))
    : OutboundStatuses;

  filteredStatuses.sort((a, b) => a.label.localeCompare(b.label));

  const handleSelect = (selectedValue: string) => {
    setSelectedStatuses((prev) => {
      const matchedStatus = filteredStatuses.find((s) => s.value === selectedValue);

      if (matchedStatus) {
        if (!prev) {
          return [matchedStatus];
        }

        if (prev.findIndex((f) => f.value === selectedValue) > -1) {
          return prev.filter((f) => f.value !== selectedValue);
        } else {
          return [...prev, matchedStatus];
        }
      }

      return prev;
    });

    table.getColumn("status")?.setFilterValue(filters);
  };

  useEffect(() => {
    setFilters(selectedStatuses.map((status) => status.value));
  }, [selectedStatuses]);

  useEffect(() => {
    const filterValue = filters.length > 0 ? filters : null;
    table.getColumn("status")?.setFilterValue(filterValue);
  }, [filters]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="gap-2 px-3 py-1.5 border-dashed">
          <Icons.addCircle className="min-h-4 min-w-4 size-4" /> Status
          {filters.length > 0 ? (
            <>
              <Separator orientation="vertical" />
              {filters.length > 2 ? (
                <span className="bg-accent px-2 py-0.5 rounded-sm text-foreground">
                  {filters.length} selected
                </span>
              ) : (
                selectedStatuses.map((status) => (
                  <span
                    key={status.value}
                    className={cn(
                      "px-2 py-0.5 rounded-sm text-foreground",
                      status.bgColor,
                      status.textColor
                    )}>
                    {status.label}
                  </span>
                ))
              )}
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-52" align="start">
        <Command>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredStatuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  className="flex justify-between"
                  onSelect={(value) => {
                    handleSelect(value);
                  }}>
                  <div className="flex items-center gap-2 w-full">
                    <Checkbox
                      key={status.value}
                      checked={selectedStatuses?.includes(status)}
                      className={cn(
                        selectedStatuses?.includes(status) ? "opacity-100" : "opacity-40"
                      )}
                    />
                    <status.icon
                      className={cn(
                        "min-h-4 min-w-4 size-4 opacity-40",
                        selectedStatuses?.includes(status) ? "opacity-100" : "opacity-40"
                      )}
                    />
                    <span className="truncate">{status.label}</span>
                    <span className="ml-auto text-muted-foreground font-mono">
                      {statusCounts.find((f) => f.value === status.value)?.count}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <div className={cn(!selectedStatuses && "hidden")}>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="w-full"
                  onClick={() => {
                    table.getColumn("status")?.setFilterValue("");
                    setSelectedStatuses([]);
                    setOpen(false);
                  }}>
                  Clear Filters
                </Button>
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
