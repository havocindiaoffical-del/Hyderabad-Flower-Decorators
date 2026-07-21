import { NextRequest, NextResponse } from "next/server";
import { getBookingsForDateRange, getCalendarBlocks, setCalendarBlock } from "@/lib/db-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "start and end dates required" }, { status: 400 });
    }
    const [bookings, blocks] = await Promise.all([
      getBookingsForDateRange(startDate, endDate),
      getCalendarBlocks(startDate, endDate),
    ]);
    return NextResponse.json({ bookings, blocks });
  } catch {
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, blocked, reason } = await request.json();
    if (!date || blocked === undefined) {
      return NextResponse.json({ error: "date and blocked required" }, { status: 400 });
    }
    await setCalendarBlock(date, blocked, reason || "");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update calendar block" }, { status: 500 });
  }
}
