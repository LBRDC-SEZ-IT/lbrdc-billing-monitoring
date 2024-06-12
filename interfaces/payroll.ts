export type PayrollStatus = "Open For Billing" | "Billed";

export type Payroll = {
  id?: string;
  client: string;
  date: string;
  status: PayrollStatus;
  amount: number;
};