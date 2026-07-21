import { NextRequest, NextResponse } from "next/server";
import { getBookingByTicketId, getBookingsByUserUid, getBookingsByPhone } from "@/lib/db-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticket = searchParams.get("ticket");
    const uid = searchParams.get("uid");
    const phone = searchParams.get("phone");

    if (ticket) {
      const booking = await getBookingByTicketId(ticket.toUpperCase());
      return NextResponse.json({ booking });
    }

    if (uid) {
      const bookings = await getBookingsByUserUid(uid);
      return NextResponse.json({ bookings });
    }

    if (phone) {
      const bookings = await getBookingsByPhone(phone);
      return NextResponse.json({ bookings });
    }

    return NextResponse.json({ error: "Provide ticket, uid, or phone parameter" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
