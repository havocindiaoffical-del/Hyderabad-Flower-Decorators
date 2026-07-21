import { NextResponse } from "next/server";
import { getBookingCounts, getRecentBookings } from "@/lib/db-helpers";

export async function GET() {
  try {
    const [counts, recentBookings] = await Promise.all([
      getBookingCounts(),
      getRecentBookings(5),
    ]);
    return NextResponse.json({ counts, recentBookings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
