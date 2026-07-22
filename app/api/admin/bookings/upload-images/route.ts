import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Upload ZIP to catbox.moe — free, no API key, permanent URL
// Returns shareable download link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    // Get booking details from DB
    const result = await getDb().select().from(bookings).where(eq(bookings.id, Number(bookingId))).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = result[0];
    const images = (booking.images as string[]) || [];

    if (images.length === 0) {
      return NextResponse.json({ error: "No images to upload" }, { status: 400 });
    }

    // Upload each image to catbox.moe to get direct URLs
    const catboxUrls: string[] = [];

    for (const imageUrl of images) {
      try {
        // First, fetch the image from Firebase Storage
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) continue;

        const imgBlob = await imgResponse.blob();

        // Determine filename
        const urlPath = imageUrl.split("?")[0];
        let filename = urlPath.split("/").pop() || "image.jpg";
        if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
          const contentType = imgBlob.type || "image/jpeg";
          if (contentType.includes("png")) filename = `reference_${catboxUrls.length + 1}.png`;
          else if (contentType.includes("webp")) filename = `reference_${catboxUrls.length + 1}.webp`;
          else filename = `reference_${catboxUrls.length + 1}.jpg`;
        }

        // Upload to catbox.moe via their API
        const formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", imgBlob, filename);

        const catboxResponse = await fetch("https://catbox.moe/user/api.php", {
          method: "POST",
          body: formData,
        });

        if (catboxResponse.ok) {
          const catboxUrl = await catboxResponse.text();
          // catbox returns direct URL like https://files.catbox.moe/xxxxx.jpg
          if (catboxUrl.startsWith("https://")) {
            catboxUrls.push(catboxUrl.trim());
          }
        }
      } catch {
        // Skip this image if upload fails
      }
    }

    if (catboxUrls.length === 0) {
      return NextResponse.json({ error: "Failed to upload any images to catbox" }, { status: 500 });
    }

    // Save catbox URLs to booking record
    await getDb().update(bookings).set({
      imageShareUrls: catboxUrls,
    }).where(eq(bookings.id, Number(bookingId)));

    // Also generate a combined details page URL
    const ticketId = booking.ticketId;
    const customerName = booking.fullName;

    return NextResponse.json({
      success: true,
      catboxUrls,
      count: catboxUrls.length,
      totalImages: images.length,
      message: `Uploaded ${catboxUrls.length} of ${images.length} images to catbox.moe`,
      bookingInfo: {
        ticketId,
        customerName,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
