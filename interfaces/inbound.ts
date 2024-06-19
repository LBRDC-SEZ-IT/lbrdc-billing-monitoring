export type InboundStatusTypes = "Partial Bill" | "Full Bill";

export type InboundAccount = {
  id?: string;
  clientDocID: string;
  developmentDocID: string;
  dateOfPeriod: string;
  status: InboundStatusTypes;
  outboundAmount: number;
  amountBilled: number;
  amountCollected: number;
  dateOfCollection: string;
};

export interface InboundAccountView extends InboundAccount {
  clientName: string,
  clientCode: string,
  developmentName: string,
}