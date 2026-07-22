import { NextRequest, NextResponse } from "next/server";
import { getAllTicketIds, getRecentBookings } from "@/lib/db-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const knownIds = searchParams.get("known_ids") || "";
    const knownSet = new Set(knownIds.split(",").filter(Boolean));

    // Fetch recent bookings (last 20 to catch new ones)
    const recentBookings = await getRecentBookings(20);

    // Find bookings not in the known set
    const newBookings = recentBookings.filter(b => !knownSet.has(b.ticket_id));

    // Get all ticket IDs for the client to maintain its known set
    const allTicketIds = await getAllTicketIds();

    return NextResponse.json({
      newBookings,
      allTicketIds,
      hasNew: newBookings.length > 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to check notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
