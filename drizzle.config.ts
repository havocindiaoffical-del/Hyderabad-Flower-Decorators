import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_cNHGqwXCl1i8@ep-delicate-mouse-au1qf5cw.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
