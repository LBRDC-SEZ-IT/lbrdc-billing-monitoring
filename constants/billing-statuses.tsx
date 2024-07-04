import { Icon, Icons } from "@/components/icons";

export type BillingStatusTypes = "Pending" | "Overdue" | "Collected";

export type BillingStatusModel = {
  value: BillingStatusTypes;
  label: string;
  icon: Icon;
  bgColor: string;
  textColor: string;
};

export const BillingStatuses: BillingStatusModel[] = [
  {
    value: "Pending",
    label: "In Progress",
    icon: Icons.statusWaiting,
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-500",
  },
  {
    value: "Overdue",
    label: "Overdue",
    icon: Icons.statusRejected,
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
  },
  {
    value: "Collected",
    label: "Collected",
    icon: Icons.statusOpen,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
  },
];
