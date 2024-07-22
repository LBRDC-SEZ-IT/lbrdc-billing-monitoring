import { v } from "convex/values";
import { GroupView } from "../interfaces/group";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getByRef = query({
  args: { refID: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
    .query("groups")
    .withIndex("by_name")
    .filter((q) => q.eq(q.field("client_ref_ID"), args.refID))
    .order("asc")
    .collect();
  }
});

export const getByID = query({
  args: {
    group_ID: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.group_ID as Id<"groups">)
  }
})

export const get = query({
  handler: async (ctx) => {
    const groups = await ctx.db.query("groups").collect();

    const groupViews = await Promise.all(groups.map(async (group) => {
      const client = await ctx.db.get(group.client_ref_ID);

      return {
        ...group,
        client_info: client,
      } as GroupView;
    }));

    return groupViews as GroupView[];
  }
})

export const create = mutation({
  args: {
    name: v.string(),
    client_ref_ID: v.string()
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("groups", {
        name: args.name,
        client_ref_ID: args.client_ref_ID as Id<"clients">,
      })

      return { success: true, message: "Successfully added a new group!"}
    } catch (error) {
      console.log("convex/groups.ts:create; ", error);
      return { success: false, message: "Failed to add group."}
    }
  }
})

export const update = mutation({
  args: {
    group_ID: v.string(),
    name: v.string(),
    client_ref_ID: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.group_ID as Id<"groups">, {
        client_ref_ID: args.client_ref_ID as Id<"clients">,
        name: args.name,
      })

      return { success: true, message: "You have successfully updated the group."}
    } catch (error) {
      console.log("convex/groups.ts:update; ", error);
      return { success: false, message: "Failed to update group."}
    }
  }
})

export const remove = mutation({
  args: {
    group_ID: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      let referenceCollections = [];

      const subgroupRefs = await ctx.db.query("subgroups").filter(q => q.eq(q.field("group_ref_ID"), args.group_ID)).collect();
      if (subgroupRefs.length > 0) {
        referenceCollections.push("Subgroups");
      }

      const outboundRefs = await ctx.db.query("outboundAccounts").filter(q => q.eq(q.field("group_ref_ID"), args.group_ID)).collect();
      if (outboundRefs.length > 0) {
        referenceCollections.push("Outbound Accounts");
      }

      if (referenceCollections.length > 0) {
        return { success: false, message: `Group cannot be deleted. It is referenced in the (${referenceCollections.join(", ")}) records.` };
      }
      
      await ctx.db.delete(args.group_ID as Id<"groups">);

      return { success: true, message: "Group successfully deleted."}
    } catch (error) {
      console.log("convex/groups.ts:update; ", error);
      return { success: false, message: "Failed to delete group."}
    }
  }
})