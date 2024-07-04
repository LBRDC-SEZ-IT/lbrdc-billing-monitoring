"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { InboundView } from "@/interfaces/inbound";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface ActionCellProps {
  row: Row<InboundView>;
}

export const ActionCellInbound = ({ row }: ActionCellProps) => {
  const rowData = row.original;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/inbound/${row.original._id}`);
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={handleClick}
        variant={"ghost"}
        size={"sm"}
        className="font-normal text-muted-foreground group">
        View{" "}
        <Icons.arrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
};
