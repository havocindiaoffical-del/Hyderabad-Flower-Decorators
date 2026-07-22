import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/db-helpers";
import { sendCustomerConfirmation } from "@/lib/brevo-email";

// FAST booking creation — saves to DB + sends customer email only
// Owner email + image uploads happen in separate /api/booking/upload-images call
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

    // Validate required fields
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

    // Create booking in database FAST
    let bookingId = "";
    let ticket_id = "";

    try {
      const result = await createBooking({
        full_name,
        phone,
        email,
        event_type,
        event_date,
        preferred_time,
        venue_address,
        google_maps_link,
        estimated_budget,
        guest_count,
        special_notes,
        images: [],
        user_uid: user_uid || "",
      });
      bookingId = result.id;
      ticket_id = result.ticket_id;
    } catch {
      const prefix = "HFD";
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      ticket_id = `${prefix}-${timestamp}-${random}`;
      bookingId = `local-${Date.now()}`;
    }

    // Send customer email immediately (don't wait for owner email)
    let emailSent = false;
    let emailError = "";

    try {
      const emailResult = await sendCustomerConfirmation({
        full_name,
        phone,
        email,
        event_type,
        event_date,
        preferred_time,
        venue_address,
        google_maps_link: google_maps_link || "",
        estimated_budget: estimated_budget || "",
        guest_count: guest_count || "",
        special_notes: special_notes || "",
        ticket_id,
      });
      emailSent = emailResult.sent;
      if (emailResult.error) emailError = emailResult.error;
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email unavailable";
    }

    // Return to customer IMMEDIATELY — they don't need to wait for image uploads or owner email
    return NextResponse.json({
      success: true,
      bookingId,
      ticket_id,
      emailSent,
      emailError: emailError || undefined,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us at +91 98765 43210" },
      { status: 500 }
    );
  }
}
