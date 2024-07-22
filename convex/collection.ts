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

export const remove = mutation({
  args: {
    id: v.id("collections")
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return { success: true, message: "Collection deleted successfully." };
    } catch (error) {
      console.error("Failed to delete collection:", error);
      return { success: false, message: "Failed to delete collection." };
    }
  }
})