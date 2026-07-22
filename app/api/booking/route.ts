import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/db-helpers";
import { uploadBookingImage } from "@/lib/firebase-storage";
import { sendBookingNotifications } from "@/lib/brevo-email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract text fields
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
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Validate phone (Indian numbers)
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian phone number" },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Upload images to Firebase Storage
    const imageUrls: string[] = [];
    const imageEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("image_")
    );

    for (const [, value] of imageEntries) {
      if (value instanceof File) {
        if (value.size > 5 * 1024 * 1024) continue;
        if (!["image/jpeg", "image/png", "image/webp"].includes(value.type)) continue;

        try {
          const url = await uploadBookingImage(value);
          imageUrls.push(url);
        } catch {
          // Image upload failed, continue without it
        }
      }
    }

    // Create booking in database
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
        images: imageUrls,
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

    // Send email notifications via Brevo to BOTH customer and owner
    let emailSent = false;
    let emailError = "";

    try {
      const emailResult = await sendBookingNotifications({
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

      emailSent = emailResult.customerEmailSent || emailResult.ownerEmailSent;

      if (emailResult.errors.length > 0) {
        emailError = emailResult.errors.join("; ");
      }
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email notification system unavailable";
    }

    return NextResponse.json(
      {
        success: true,
        bookingId,
        ticket_id,
        emailSent,
        emailError: emailError || undefined,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us at +91 98765 43210" },
      { status: 500 }
    );
  }
}
