import { NextResponse } from "next/server";
import { getAllTicketIds } from "@/lib/db-helpers";

export async function GET() {
  try {
    const ticketIds = await getAllTicketIds();
    return NextResponse.json({ ticketIds });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch ticket IDs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
