import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

const statuses: Status[] = [
  {
    value: "Billed",
    label: "Billed",
    icon: Icons.statusComplete,
    count: 2,
  },
  {
    value: "Open",
    label: "Open",
    icon: Icons.statusOpen,
    count: 3,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Icons.statusCancelled,
    count: 4,
  },
];

export default function DataTableFilter() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Status | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="gap-2 px-3 py-1.5">
          <Icons.addCircle className="min-h-4 min-w-4 size-4" /> Status
          {selectedValue ? (
            <>
              <Separator orientation="vertical" />
              <span className="bg-accent px-2 py-0.5 rounded-sm text-foreground">
                {selectedValue.label}
              </span>
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
              {statuses
                .filter((item) => item.count > 0)
                .map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    className="flex justify-between"
                    onSelect={(value) => {
                      setSelectedValue(statuses.find((item) => item.value === value) || null);
                    }}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        key={status.value}
                        checked={selectedValue?.value === status.value}
                        className={cn(
                          selectedValue?.value === status.value ? "opacity-100" : "opacity-40"
                        )}
                      />
                      <status.icon className="min-h-4 min-w-4 size-4 opacity-40" />
                      <span className="truncate">{status.label}</span>
                    </div>
                    <span className="text-right text-muted-foreground">{status.count}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <div className={cn(!selectedValue && "hidden")}>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="w-full"
                  onClick={() => {
                    setSelectedValue(null);
                    setOpen(false);
                  }}>
                  Clear
                </Button>
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
