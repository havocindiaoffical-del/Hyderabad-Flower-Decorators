import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Serve a single booking image directly from Neon DB
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticket_id: string; index: string }> }
) {
  try {
    const { ticket_id, index } = await params;
    const idx = parseInt(index, 10);

    if (isNaN(idx) || idx < 0) {
      return NextResponse.json({ error: "Invalid image index" }, { status: 400 });
    }

    const result = await getDb().select({ images: bookings.images }).from(bookings).where(eq(bookings.ticketId, ticket_id)).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const images = (result[0].images as string[]) || [];
    if (idx >= images.length) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const dataUrl = images[idx];
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 500 });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}
