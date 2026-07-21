import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_cNHGqwXCl1i8@ep-delicate-mouse-au1qf5cw.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require";

const client = postgres(connectionString, {
  ssl: "require",
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
