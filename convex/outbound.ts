import { v } from "convex/values";
import { Outbound, OutboundView } from "../interfaces/outbound";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    outboundID: v.optional(v.id("outboundAccounts"))
  },
  handler: async (ctx, args) => {
    let outbounds;
    if (args.outboundID) {
      outbounds = await ctx.db.query("outboundAccounts").filter(q => q.eq(q.field("_id"), args.outboundID)).collect() as Outbound[];
    } else {
      outbounds = await ctx.db.query("outboundAccounts").collect() as Outbound[];
    }
    
    const clients = await ctx.db.query("clients").collect();
    const groups = await ctx.db.query("groups").collect();
    const subgroups = await ctx.db.query("subgroups").collect();

    return outbounds.map(outbound => ({
      ...outbound,
      clientCode: clients.find((f) => f._id === outbound.clientRefID)?.code,
      clientName: clients.find((f) => f._id === outbound.clientRefID)?.name,
      groupName: groups.find((f) => f._id === outbound.groupRefID)?.name,
      subgroupName: outbound.subgroupRefID ? subgroups.find((f) => f._id === outbound.subgroupRefID)?.name : undefined,
    })) as OutboundView[];
  }
})

export const create = mutation({
  args: {
    code: v.string(),
    clientRefID: v.string(),
    groupRefID: v.string(),
    subgroupRefID: v.optional(v.string(),),
    authorRefID: v.string(),
    datePeriod: v.object({
      from: v.string(),
      to: v.string(),
    }),
    totalAmount: v.number(),
    categories: v.array(v.object({
      name: v.string(),
      amount: v.number()
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
    await ctx.db.insert("outboundAccounts", {
      code: args.code,
      clientRefID: args.clientRefID,
      groupRefID: args.groupRefID,
      subgroupRefID: args.subgroupRefID,
      authorRefID: args.authorRefID,
      datePeriod: args.datePeriod,
      totalAmount: args.totalAmount,
      categories: args.categories,
      status: args.status,
      statusInfo: args.statusInfo,
      approvalInfo: args.approvalInfo
    });
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