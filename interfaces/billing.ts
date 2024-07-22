import { Collection, CollectionInfo } from "./collection";

export interface Billing {
  _id?: string;
  account_ref_ID: string;
  code: string;
  amount: number;
  timestamp: string;
  _creationTime: number;
}

export interface BillingWithCollection extends Billing {
  collections?: Collection[];
}

export interface BillingWithCollectionRemarks extends Billing {
  billingRemarksCount?: number;
  collections?: CollectionInfo[];
}