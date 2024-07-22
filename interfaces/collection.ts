import { Description } from "./description";

export interface Collection {
  _id?: string;
  code: string;
  billing_ref_ID: string;
  amount: number;
  timestamp: string;
  _creationTime: number;
}

export interface CollectionInfo extends Collection {
  remarks: Description[];
}