import { NextResponse } from "next/server";
import { getBookingCounts, getRecentBookings } from "@/lib/db-helpers";

export async function GET() {
  try {
    const [counts, recentBookings] = await Promise.all([
      getBookingCounts(),
      getRecentBookings(5),
    ]);
    return NextResponse.json({ counts, recentBookings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
