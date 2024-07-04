import { z } from "zod";

export const inboundAccountSchema = z.object({
  outboundAmount: z.number(),
  billableAmount: z.coerce.number().min(1, { message: "Billable Amount must be greater than 0."})
})