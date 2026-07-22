import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Add zip_url column
    const check1 = await getDb().execute(sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'zip_url'
    `);
    if (check1.length === 0) {
      await getDb().execute(sql`ALTER TABLE bookings ADD COLUMN zip_url VARCHAR(500)`);
    }

    // Add upload_status column
    const check2 = await getDb().execute(sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'upload_status'
    `);
    if (check2.length === 0) {
      await getDb().execute(sql`ALTER TABLE bookings ADD COLUMN upload_status VARCHAR(20) DEFAULT 'pending'`);
    }

    return NextResponse.json({ success: true, message: "Migration complete — zip_url + upload_status columns added" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Migration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
