import { v } from "convex/values";
import { BillingWithCollection, BillingWithCollectionRemarks } from "../interfaces/billing";
import { CollectionInfo } from "../interfaces/collection";
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

      const billingsWithCollectionsRemarks = await Promise.all(billings.map(async (billing) => {
        const billingRemarksCount = await ctx.db
          .query("descriptions")
          .withIndex("by_ref_ID", (q) => q.eq("ref_ID", billing._id))
          .collect();

        const collections = await Promise.all((await ctx.db.query("collections")
          .withIndex("by_billing_ref", (q) => q.eq("billing_ref_ID", billing._id as Id<"billings">))
          .collect()).map(async (collection) => {
            const remarks = await ctx.db.query("descriptions")
              .withIndex("by_ref_ID", (q) => q.eq("ref_ID", collection._id))
              .collect();
            
            return {
              ...collection,
              remarks: remarks,
            } as CollectionInfo;
          }));
  
        return {
          ...billing,
          collections: collections,
          billingRemarksCount: billingRemarksCount.length,
        } as BillingWithCollectionRemarks;
      }));

    return billingsWithCollectionsRemarks as BillingWithCollectionRemarks[]
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

export const remove = mutation({
  args: {
    id: v.id("billings")
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return { success: true, message: "Billing deleted successfully." };
    } catch (error) {
      console.error("Failed to delete billing:", error);
      return { success: false, message: "Failed to delete billing." };
    }
  }
})