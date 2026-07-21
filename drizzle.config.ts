import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ||
      "postgresql://havocindiaoffical_gm:PwPqgFVGyeCSUsfMPfACSQ@lilac-tuna-29930.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=require&options=--cluster=lilac-tuna-29930",
  },
});
