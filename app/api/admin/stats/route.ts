import { NextResponse } from "next/server";
import { getBookingCounts, getRecentBookings, getAllTicketIds } from "@/lib/db-helpers";

export async function GET() {
  try {
    const [counts, recentBookings, allTicketIds] = await Promise.all([
      getBookingCounts(),
      getRecentBookings(5),
      getAllTicketIds(),
    ]);
    return NextResponse.json({ counts, recentBookings, allTicketIds });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
