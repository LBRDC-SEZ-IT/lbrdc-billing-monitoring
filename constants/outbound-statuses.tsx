import { Icon, Icons } from "@/components/icons";

export type OutboundStatusTypes = "Approval" | "Rejected" | "Open" | "Cancelled" | "Completed";

export type OutboundStatusModel = {
  value: OutboundStatusTypes;
  label: string;
  icon: Icon;
  bgColor: string;
  textColor: string;
};

export const OutboundStatuses: OutboundStatusModel[] = [
  {
    value: "Approval",
    label: "For Approval",
    icon: Icons.statusWaiting,
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-500",
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: Icons.statusRejected,
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
  },
  {
    value: "Open",
    label: "Open",
    icon: Icons.statusOpen,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Icons.statusCancelled,
    bgColor: "bg-neutral-500/20",
    textColor: "text-neutral-500",
  },
  {
    value: "Completed",
    label: "Billed",
    icon: Icons.statusComplete,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
  },
];
