import { Icon, Icons } from "@/components/icons";

export type ClientStatusTypes = "Active" | "Inactive" | "End of Contract";

export type ClientStatusModel = {
  value: ClientStatusTypes;
  label: string;
  icon: Icon;
  bgColor: string;
  textColor: string;
};

export const ClientStatuses: ClientStatusModel[] = [
  {
    value: "Active",
    label: "Active",
    icon: Icons.statusComplete,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500",
  },
  {
    value: "Inactive",
    label: "Inactive",
    icon: Icons.statusCancelled,
    bgColor: "bg-neutral-500/20",
    textColor: "text-neutral-500",
  },
  {
    value: "End of Contract",
    label: "End of Contract",
    icon: Icons.statusRejected,
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
  },
];
