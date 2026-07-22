import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql } from "drizzle-orm";

// Migration: add image_share_urls column to bookings table
// Call POST /api/migrate once after deployment
export async function POST() {
  try {
    // Check if column already exists
    const checkResult = await getDb().execute(sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'image_share_urls'
    `);

    if (checkResult.length > 0) {
      return NextResponse.json({ success: true, message: "Column image_share_urls already exists" });
    }

    // Add the column
    await getDb().execute(sql`
      ALTER TABLE bookings ADD COLUMN image_share_urls JSONB DEFAULT '[]'::jsonb
    `);

    return NextResponse.json({ success: true, message: "Added image_share_urls column to bookings table" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Migration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
