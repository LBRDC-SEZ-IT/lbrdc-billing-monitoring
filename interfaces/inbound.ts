// export type InboundStatusTypes = "Partial Bill" | "Full Bill";

import { BillingWithCollection } from "./billing";

// export type InboundAccount = {
//   id?: string;
//   clientDocID: string;
//   developmentDocID: string;
//   dateOfPeriod: string;
//   status: InboundStatusTypes;
//   outboundAmount: number;
//   amountBilled: number;
//   amountCollected: number;
//   dateOfCollection: string;
// };

// export interface InboundAccountView extends InboundAccount {
//   clientName: string,
//   clientCode: string,
//   developmentName: string,
// }

export interface Inbound {
  _id?: string;
  author_ref_ID: string;
  billable_amount: number;
  client_ref_ID: string;
  outbound_ref_ID: string;
  _creationTime: number;
}

export interface InboundView extends Inbound {
  clientName?: string;
  clientCode?: string;
  code?: string;
  groupName?: string;
  subgroupName?: string;
  datePeriod?: {
    from?: string;
    to?: string;
  }
  amount?: number;
  billings?: BillingWithCollection[],
  categories: {
    name: string;
    amount: number;
  }[];
}