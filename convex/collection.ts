import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const create = mutation({
  args: {
    code: v.string(),
    amount: v.float64(),
    date: v.string(),
    billing_ref_ID: v.id("billings")
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("collections", {
      billing_ref_ID: args.billing_ref_ID,
      amount: args.amount,
      timestamp: args.date,
      code: args.code
    })
  }
})