import { v } from "convex/values";
import { BillingWithCollection } from "../interfaces/billing";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getWithCollectionByID = query({
  args: {
    ID: v.id("billings"),
  },
  handler: async (ctx, args) => {
    const billing = await ctx.db.get(args.ID);

    if (billing) {
      const collections = await ctx.db.query("collections")
        .withIndex("by_billing_ref", (q) => q.eq("billing_ref_ID", billing._id as Id<"billings">))
        .collect();

      return {
        ...billing,
        collections: collections,
      } as BillingWithCollection;
    } else {
      return undefined
    }
  }
})

export const getByRef = query({
  args: {
    ref_ID: v.string()
  },
  handler: async (ctx, args) => {
    const billings = await ctx.db
      .query("billings")
      .filter((q) => q.eq(q.field("account_ref_ID"), args.ref_ID))
      .collect();

    const billingsWithCollections = await Promise.all(billings.map(async (billing) => {
      const collections = await ctx.db.query("collections")
        .withIndex("by_billing_ref", (q) => q.eq("billing_ref_ID", billing._id as Id<"billings">))
        .collect();
        
      return {
        ...billing,
        collections: collections,
      } as BillingWithCollection;
    }));

    return billingsWithCollections as BillingWithCollection[]
  }
})

export const create = mutation({
  args: {
    code: v.string(),
    amount: v.float64(),
    date: v.string(),
    account_ref_ID: v.id("inboundAccounts")
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("billings", {
      account_ref_ID: args.account_ref_ID,
      amount: args.amount,
      timestamp: args.date,
      code: args.code
    })
  }
})