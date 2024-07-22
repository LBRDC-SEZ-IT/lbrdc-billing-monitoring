import { v } from "convex/values";
import { Client } from "../interfaces/client";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    client_id: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      let query = ctx.db.query("clients");

      if (args.client_id) {
        query = query.filter((q) => q.eq(q.field("_id"), args.client_id));
      }

      const clients = await query.collect() as Client[];
      
      return clients;
    } catch (error) {
      console.error("Failed to get clients: ", error);
    }
  }
})

export const create = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    contract_info: v.array(v.object({
      status: v.string(),
      from_date: v.string(),
      to_date: v.string(),
      timestamp: v.string()
    }))
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("clients", {
        code: args.code,
        name: args.name,
        description: args.description,
        contracts: args.contract_info
      })

      return { success: true, message: "Successfully created a new client." }
    } catch (error) {
      console.log("convex/clients.ts:create; ", error);
      return { success: false, message: "Failed to create client." }
    }
  }
})

export const update = mutation({
  args: {
    id: v.id("clients"),
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    contract_info: v.object({
      status: v.string(),
      from_date: v.string(),
      to_date: v.string(),
      timestamp: v.string()
    })
  },
  handler: async (ctx, args) => {
    try {
      const client = await ctx.db.get(args.id);

      const updatedContracts = client?.contracts.map((contract) => {
        if (contract.status === "Active") {
          return {
            ...contract,
            from_date: args.contract_info.from_date,
            to_date: args.contract_info.to_date,
            timestamp: args.contract_info.timestamp,
          };
        }
        return contract;
      });

      await ctx.db.patch(args.id, {
        code: args.code,
        name: args.name,
        description: args.description,
        contracts: updatedContracts
      })

      return { success: true, message: `Successfully updated the details of '${args.name}' client.` }
    } catch (error) {
      console.log("convex/clients.ts:update; ", error);
      return { success: false, message: "Failed to update client." }
    }
  }
});

export const renew = mutation({
  args: {
    clientID: v.id("clients"),
    new_contract: v.object({
      status: v.string(),
      from_date: v.string(),
      to_date: v.string(),
      timestamp: v.string()
    })
  },
  handler: async (ctx, args) => {
    try {
      const client = await ctx.db.get(args.clientID);

      if (client) {
        const updatedContracts = client.contracts.map(contract => {
          if (contract.status === "Active") {
            return { ...contract, status: "Inactive" };
          }
          return contract;
        });

        updatedContracts.push(args.new_contract);

        await ctx.db.patch(client._id, {
          contracts: updatedContracts
        });
  
        return { success: true, message: `Successfully updated the details of '${client.name}' client.` }
      } else {
        return { success: false, message: "Can't find/fetch client information. Please try again." }
      }
    } catch (error) {
      console.log("convex/clients.ts:renew; ", error);
      return { success: false, message: "Failed to renew client." }
    }
  }
})

export const remove = mutation({
  args: {
    clientId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      let referenceCollections = [];

      const groupRefs = await ctx.db.query("groups").filter(q => q.eq(q.field("client_ref_ID"), args.clientId)).collect();
      if (groupRefs.length > 0) {
        referenceCollections.push("Groups");
      }

      const inboundRefs = await ctx.db.query("inboundAccounts").filter(q => q.eq(q.field("client_ref_ID"), args.clientId)).collect();
      if (inboundRefs.length > 0) {
        referenceCollections.push("Inbound Accounts");
      }

      const outboundRefs = await ctx.db.query("outboundAccounts").filter(q => q.eq(q.field("client_ref_ID"), args.clientId)).collect();
      if (outboundRefs.length > 0) {
        referenceCollections.push("Outbound Accounts");
      }

      if (referenceCollections.length > 0) {
        return { success: false, message: `Client cannot be deleted. It is referenced in the (${referenceCollections.join(", ")}) records.` };
      }
      
      await ctx.db.delete(args.clientId as Id<"clients">);

      return { success: true, message: "Client successfully deleted." };
    } catch (error) {
      console.log("convex/clients.ts:deleteClient; ", error);
      return { success: false, message: "Failed to delete client." };
    }
  }
});