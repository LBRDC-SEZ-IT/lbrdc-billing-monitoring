import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByRef = query({
  args: { refID: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
    .query("groups")
    .withIndex("by_name")
    .filter((q) => q.eq(q.field("clientRefID"), args.refID))
    .order("asc")
    .collect();
  }
});