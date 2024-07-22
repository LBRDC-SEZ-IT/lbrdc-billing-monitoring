import { v } from "convex/values";
import { BillingWithCollection } from "../interfaces/billing";
import { Inbound, InboundView } from "../interfaces/inbound";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    inboundID: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("inboundAccounts");

    if (args.inboundID) {
      query = query.filter((q) => q.eq(q.field("_id"), args.inboundID));
    }

    const inbounds = await query.collect() as Inbound[];

    const inboundViews = await Promise.all(inbounds.map(async (inbound) => {
      const client = await ctx.db.get(inbound.client_ref_ID as Id<"clients">);
      const outbound = await ctx.db.get(inbound.outbound_ref_ID as Id<"outboundAccounts">);
      const group = await ctx.db.get(outbound?.group_ref_ID as Id<"groups">);
      const subgroup = outbound?.subgroup_ref_ID ? await ctx.db.get(outbound?.subgroup_ref_ID as Id<"subgroups">) : null;
      const categories = outbound?.categories;
      const billings = await ctx.db.query("billings")
        .withIndex("by_account_ref", (q) => q.eq("account_ref_ID", inbound._id as Id<"inboundAccounts">))
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

      let totalCollections = 0;
      let collectionsCount = 0;

      billingsWithCollections.forEach(billing => {
        billing.collections?.forEach(collection => {
          collectionsCount++;
          totalCollections += collection.amount;
        });
      });

      const totalBillings = billingsWithCollections.reduce((sum, billing) => sum + billing.amount, 0);
      const balance = totalBillings - totalCollections;

      return {
        ...inbound,
        clientCode: client?.code,
        clientName: client?.name,
        code: outbound?.code,
        groupName: group?.name,
        subgroupName: subgroup ? subgroup?.name : "",
        datePeriod: {
          from: outbound?.datePeriod.from,
          to: outbound?.datePeriod.to,
        },
        amount: outbound?.totalAmount,
        billings: billingsWithCollections,
        categories: categories,
        totalBillings: totalBillings,
        balance: balance,
        collectionCount: collectionsCount,
        totalCollections: totalCollections,
      } as InboundView
    }))

    return inboundViews as InboundView[];
  }
})

export const getByID = query({
  args: {
    inboundID: v.string(),
  },
  handler: async (ctx, args) => {
    const inbound = await ctx.db
      .query("inboundAccounts")
      .filter((q) => q.eq(q.field("_id"), args.inboundID))
      .first();

    return inbound;
  }
})

export const create = mutation({
  args: {
    author_ref_ID: v.id("users"),
    billable_amount: v.float64(),
    client_ref_ID: v.id("clients"),
    outbound_ref_ID: v.id("outboundAccounts")
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("inboundAccounts", {
      author_ref_ID: args.author_ref_ID,
      billable_amount: args.billable_amount,
      client_ref_ID: args.client_ref_ID,
      outbound_ref_ID: args.outbound_ref_ID
    })
  }
})

