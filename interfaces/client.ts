import { ConvexStandard } from "./convex";

export interface contract {
  status: string;
  from_date: string;
  to_date: string;
  timestamp: string;
}

export interface Client extends ConvexStandard {
  code: string;
  name: string;
  description: string;
  contracts: contract[];
}