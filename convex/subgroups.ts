import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByRef = query({
  args: { refID: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("subgroups")
      .withIndex("by_name")
      .filter((q) => q.eq(q.field("group_ref_ID"), args.refID))
      .order("asc")
      .collect();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    group_ref_ID: v.id("groups")
  },
  handler: async (ctx, args) => {
    try {
      const group = await ctx.db.get(args.group_ref_ID);

      if (!group) {
        return { success: false, message: "Group is missing, unable to add subgroup."}
      }

      await ctx.db.insert("subgroups", {
        name: args.name,
        group_ref_ID: args.group_ref_ID
      })
      
      return { success: true, message: "You have successfully created a new subgroup!"}
    } catch (error) {
      console.log("convex/subgroups.ts:create; ", error);
      return { success: false, message: "Failed to create new subgroup."}
    }
  }
})