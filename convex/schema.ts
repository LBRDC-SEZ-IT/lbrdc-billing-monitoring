import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    code: v.string(),
    name: v.string(),
  }).index("by_name", ["name"]),
  groups: defineTable({
    clientRefID: v.id("clients"),
    name: v.string(),
  }).index("by_name", ["name"]),
  subgroups: defineTable({
    groupRefID: v.id("groups"),
    name: v.string(),
  }).index("by_name", ["name"]),
  outboundAccounts: defineTable({
    code: v.string(),
    clientRefID: v.string(),
    groupRefID: v.string(),
    subgroupRefID: v.optional(v.string()),
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
  }),
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});