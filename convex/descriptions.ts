import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByRef = query({
  args: {
    ref_ID: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const descriptions = await ctx.db
      .query("descriptions")
      .withIndex("by_ref_ID", (i) => i.eq("ref_ID", args.ref_ID))
      .filter((f) => f.eq(f.field("type"), args.type) )
      .collect()

    return descriptions;
  },
})

export const create = mutation({
  args: {
    ref_ID: v.string(),
    type: v.string(),
    description: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("descriptions", {
      ref_ID: args.ref_ID,
      type: args.type,
      description: args.description,
    })
  },
})

export const remove = mutation({
  args: {
    ID: v.id("descriptions")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.ID)
  }
})