export type BillingType = "Partial Bill" | "Full Bill";

export type Billing = {
  id?: string;
  client: string;
  dateOfPeriod: string;
  type: BillingType;
  payrollAmount: number;
  amountBilled: number;
  amountCollected: number;
  dateOfCollection: string;
};