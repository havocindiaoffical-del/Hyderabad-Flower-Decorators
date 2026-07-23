import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookingByTicketId } from "@/lib/db-helpers";
import { sendCustomerConfirmation, sendOwnerNotification } from "@/lib/brevo-email";
import { getDb } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hyderabadflowerdecorators.netlify.app";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const full_name = (formData.get("full_name") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const event_type = (formData.get("event_type") as string)?.trim() || "";
    const event_date = (formData.get("event_date") as string)?.trim() || "";
    const preferred_time = (formData.get("preferred_time") as string)?.trim() || "";
    const venue_address = (formData.get("venue_address") as string)?.trim() || "";
    const google_maps_link = (formData.get("google_maps_link") as string)?.trim() || "";
    const estimated_budget = (formData.get("estimated_budget") as string)?.trim() || "";
    const guest_count = (formData.get("guest_count") as string)?.trim() || "";
    const special_notes = (formData.get("special_notes") as string)?.trim() || "";
    const user_uid = (formData.get("user_uid") as string)?.trim() || "";

    if (!full_name || !phone || !email || !event_type || !event_date || !preferred_time || !venue_address) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit Indian phone number" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // Collect image files and convert to base64 data URLs for DB storage
    const imageDataUrls: string[] = [];
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key.startsWith("image_") && value instanceof File) {
        if (value.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(value.type)) {
          try {
            const arrayBuffer = await value.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");
            const dataUrl = `data:${value.type};base64,${base64}`;
            imageDataUrls.push(dataUrl);
          } catch {
            // Skip this image if conversion fails
          }
        }
      }
    }

    // Create booking WITH images stored in Neon DB
    let bookingId = "";
    let ticket_id = "";

    try {
      const result = await createBooking({
        full_name, phone, email, event_type, event_date, preferred_time,
        venue_address, google_maps_link, estimated_budget, guest_count,
        special_notes, images: imageDataUrls, user_uid: user_uid || "",
      });
      bookingId = result.id;
      ticket_id = result.ticket_id;
    } catch (dbErr) {
      return NextResponse.json(
        { error: `Failed to create booking: ${dbErr instanceof Error ? dbErr.message : "DB error"}` },
        { status: 500 }
      );
    }

    // Build image serving URLs (serve from Neon via API)
    const imageServeUrls = imageDataUrls.map((_, i) =>
      `${SITE_URL}/api/booking/image/${ticket_id}/${i}`
    );

    // Photo page URL for owner email "Access Photos" button
    const photosUrl = imageDataUrls.length > 0
      ? `${SITE_URL}/api/booking/photos/${ticket_id}`
      : "";

    // Mark upload complete and save serving URLs IMMEDIATELY
    try {
      await getDb().update(bookings).set({
        imageShareUrls: imageServeUrls,
        zipUrl: photosUrl,
        uploadStatus: "complete",
      }).where(eq(bookings.ticketId, ticket_id));
    } catch {
      // Non-critical — images are still in DB, just URLs not saved
    }

    // Send customer email
    let emailSent = false;
    let emailError = "";
    try {
      const emailResult = await sendCustomerConfirmation({
        full_name, phone, email, event_type, event_date, preferred_time,
        venue_address, google_maps_link: google_maps_link || "",
        estimated_budget: estimated_budget || "", guest_count: guest_count || "",
        special_notes: special_notes || "", ticket_id,
      });
      emailSent = emailResult.sent;
      if (emailResult.error) emailError = emailResult.error;
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email unavailable";
    }

    // Send owner email with "Access Photos" button
    try {
      await sendOwnerNotification({
        full_name, phone, email, event_type, event_date, preferred_time,
        venue_address, google_maps_link: google_maps_link || "",
        estimated_budget: estimated_budget || "", guest_count: guest_count || "",
        special_notes: special_notes || "", ticket_id,
        image_count: imageDataUrls.length,
        zip_url: photosUrl,
      });
    } catch {
      // Owner email failure is non-critical
    }

    return NextResponse.json({
      success: true,
      bookingId,
      ticket_id,
      emailSent,
      emailError: emailError || undefined,
      image_count: imageDataUrls.length,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us at +91 98765 43210" },
      { status: 500 }
    );
  }
}
