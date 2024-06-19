import { Icons } from "@/components/icons";
import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";

export type OutboundStatusTypes = "Approval" | "Rejected" | "Open" | "Cancelled" | "Completed";

export type OutboundStatusModel = {
  value: OutboundStatusTypes;
  label: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

export const OutboundStatuses: OutboundStatusModel[] = [
  {
    value: "Approval",
    label: "For Approval",
    icon: Icons.statusWaiting,
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-500"
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: Icons.statusRejected,
    bgColor: "bg-red-500/20",
    textColor: "text-red-500"
  },
  {
    value: "Open",
    label: "Open",
    icon: Icons.statusOpen,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500"
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Icons.statusCancelled,
    bgColor: "bg-neutral-500/20",
    textColor: "text-neutral-500"
  },
  {
    value: "Completed",
    label: "Billed",
    icon: Icons.statusComplete,
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-500"
  }
]

type PayableCategory = {
  name: string;
  amount: number;
}

type CreatedInfo = {
  userID: string;
  userFirstName: string;
  userLastName: string;
  timestamp: Timestamp;
}

type UpdateInfo = {
  userID: string;
  userFirstName: string;
  userLastName: string;
  timestamp: Timestamp;
}

type ApproveInfo = { 
  userID: string;
  userFirstName: string;
  userLastName: string;
  timestamp: Timestamp;
}

export type OutboundAccount = {
  docID?: string;
  code: string;
  clientDocID: string;
  developmentDocID: string;
  locationDocID: string;
  datePeriod: string;
  totalAmount: number;
  payableCategories: PayableCategory[];
  status: OutboundStatusTypes;
  statusUpdatedBy: UpdateInfo;
  createdBy: CreatedInfo;
  approvedBy?: ApproveInfo;
};

export interface OutboundAccountView extends OutboundAccount {
  clientName: string,
  clientCode: string,
  developmentName: string,
}