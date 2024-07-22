import { v } from "convex/values";
import { Outbound, OutboundView } from "../interfaces/outbound";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    outboundID: v.optional(v.id("outboundAccounts")),
    status: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("outboundAccounts");

    if (args.outboundID) {
      query = query.filter(q => q.eq(q.field("_id"), args.outboundID));
    }

    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }

    const outbounds = await query.collect() as Outbound[];
    
    const clients = await ctx.db.query("clients").collect();
    const groups = await ctx.db.query("groups").collect();
    const subgroups = await ctx.db.query("subgroups").collect();

    return outbounds.map(outbound => ({
      ...outbound,
      clientCode: clients.find((f) => f._id === outbound.client_ref_ID)?.code,
      clientName: clients.find((f) => f._id === outbound.client_ref_ID)?.name,
      groupName: groups.find((f) => f._id === outbound.group_ref_ID)?.name,
      subgroupName: outbound.subgroup_ref_ID ? subgroups.find((f) => f._id === outbound.subgroup_ref_ID)?.name : undefined,
    })) as OutboundView[];
  }
})

export const create = mutation({
  args: {
    code: v.string(),
    client_ref_ID: v.string(),
    group_ref_ID: v.string(),
    subgroup_ref_ID: v.optional(v.string(),),
    author_ref_ID: v.string(),
    datePeriod: v.object({
      from: v.string(),
      to: v.string(),
    }),
    totalAmount: v.float64(),
    categories: v.array(v.object({
      name: v.string(),
      amount: v.float64()
    })),
    status: v.string(),
    statusInfo: v.object({
      userID: v.string(),
      timestamp: v.string(),
    }),
    approvalInfo: v.optional(v.object({
      userID: v.string(),
      timestamp: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("outboundAccounts", {
        code: args.code,
        client_ref_ID: args.client_ref_ID,
        group_ref_ID: args.group_ref_ID,
        subgroup_ref_ID: args.subgroup_ref_ID,
        author_ref_ID: args.author_ref_ID,
        datePeriod: args.datePeriod,
        totalAmount: args.totalAmount,
        categories: args.categories,
        status: args.status,
        statusInfo: args.statusInfo,
        approvalInfo: args.approvalInfo
      });

      return { success: true, message: "You have successfully added a new account!" }
    } catch (error) {
      console.log("convex/outbound.ts:create; ", error)
      return { success: false, message: "Failed to add a new account." }
    }
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("outboundAccounts"),
    userID: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      statusInfo: {
        userID: args.userID,
        timestamp: Date.now().toString(),
      }
    })
  },
});