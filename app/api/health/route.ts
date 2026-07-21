import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const url = process.env.DATABASE_URL ? "SET" : "NOT SET";
  const isCockroach = process.env.DATABASE_URL?.includes("cockroachlabs.cloud") ?? false;

  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "connected", database: isCockroach ? "CockroachDB" : "PostgreSQL", url_present: url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "disconnected", database: isCockroach ? "CockroachDB" : "PostgreSQL", url_present: url, error: message }, { status: 503 });
  }
}
