import { z } from "zod";

export const outgoingAccountSchema = z.object({
  client: z.string().min(1, { message: "Please select a client to continue." }),
  group: z.string().min(1, { message: "Please select a group." }),
  subgroup: z.string().optional(),
  datePeriodFrom: z.date({ required_error: "Please select a start date." }),
  datePeriodTo: z.date({ required_error: "Please select an end date." }),
  categories: z.array(z.object({
    name: z.string().min(1, { message: "Name is required." }),
    amount: z.number().min(1, { message: "Amount must be greater than 0." })
  })).min(1, { message: "Please add at least 1 item." })
}).refine((data) => data.datePeriodFrom < data.datePeriodTo, {
  path: ["datePeriodTo"],
  message: "From date must be before to date",
});