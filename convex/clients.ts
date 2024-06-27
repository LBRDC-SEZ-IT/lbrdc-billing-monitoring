import { query } from "./_generated/server";

export const get = query(async({ db }) => {
  return await db.query("clients").withIndex("by_name").order("asc").collect();
});