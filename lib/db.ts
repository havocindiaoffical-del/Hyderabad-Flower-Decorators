import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: PostgresJsDatabase<typeof schema> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const isCockroachDB = connectionString.includes("cockroachlabs.cloud");
  const isNeon = connectionString.includes("neon.tech");

  _client = postgres(connectionString, {
    ssl: isCockroachDB
      ? { rejectUnauthorized: false }
      : isNeon
        ? "require"
        : "require",
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(_client, { schema });
  return _db;
}
