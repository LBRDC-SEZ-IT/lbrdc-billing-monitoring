import { Client } from "./client";
import { ConvexStandard } from "./convex";

export interface Group extends ConvexStandard {
  client_ref_ID: string;
  name: string;
}

export interface GroupView extends Group {
  client_info: Client;
}