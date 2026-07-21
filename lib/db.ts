import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ||
  "postgresql://havocindiaoffical_gm:PwPqgFVGyeCSUsfMPfACSQ@lilac-tuna-29930.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=require&options=--cluster=lilac-tuna-29930";

const client = postgres(connectionString, {
  ssl: "require",
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
