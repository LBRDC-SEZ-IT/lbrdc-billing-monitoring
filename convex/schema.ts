import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    contracts: v.array(v.object({
      status: v.string(),
      from_date: v.string(),
      to_date: v.string(),
      timestamp: v.string()
    }))
  }).index("by_name", ["name"]),

  groups: defineTable({
    client_ref_ID: v.id("clients"),
    name: v.string(),
  }).index("by_name", ["name"]),

  subgroups: defineTable({
    group_ref_ID: v.id("groups"),
    name: v.string(),
  }).index("by_name", ["name"]),

  inboundAccounts: defineTable({
    author_ref_ID: v.id("users"),
    billable_amount: v.float64(),
    client_ref_ID: v.id("clients"),
    outbound_ref_ID: v.id("outboundAccounts"),
  }),

  outboundAccounts: defineTable({
    code: v.string(),
    client_ref_ID: v.string(),
    group_ref_ID: v.string(),
    subgroup_ref_ID: v.optional(v.string()),
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
  }),

  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  billings: defineTable({
    account_ref_ID: v.id("inboundAccounts"),
    code: v.string(),
    amount: v.float64(),
    timestamp: v.string(),
  }).index("by_account_ref", ["account_ref_ID"]),

  collections: defineTable({
    billing_ref_ID: v.id("billings"),
    code: v.string(),
    amount: v.float64(),
    timestamp: v.string()
  }).index("by_billing_ref", ["billing_ref_ID"]),

  descriptions: defineTable({
    ref_ID: v.string(),
    type: v.string(),
    description: v.string(),
  }).index("by_ref_ID", ["ref_ID"])
});