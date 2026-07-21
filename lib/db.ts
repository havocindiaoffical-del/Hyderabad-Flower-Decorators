import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_cNHGqwXCl1i8@ep-delicate-mouse-au1qf5cw.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
