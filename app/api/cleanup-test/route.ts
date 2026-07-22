import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/schema";

// One-time cleanup: delete test bookings created during email debugging
export async function POST() {
  try {
    // Delete bookings with IDs 7, 8, 9, 10 (test bookings from curl testing)
    await getDb().delete(bookings).where(
      inArray(bookings.id, [7, 8, 9, 10])
    );
    return NextResponse.json({ success: true, message: "Test bookings (IDs 7-10) deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
