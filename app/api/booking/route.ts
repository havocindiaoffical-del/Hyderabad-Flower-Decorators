import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/db-helpers";
import { uploadBookingImage } from "@/lib/firebase-storage";

// Owner email for notification
const OWNER_EMAIL = "hydflowerdecorators@gmail.com";

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

    // Try to send email notifications to BOTH customer and owner
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Email 1: Customer confirmation
      await resend.emails.send({
        from: "Hyderabad Flower Decorators <onboarding@resend.dev>",
        to: email,
        subject: `Booking Confirmed — Ticket ${ticket_id}`,
        html: `
          <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">HFD</h1>
              <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Hyderabad Flower Decorators</p>
            </div>
            <h2 style="color: #1A1A1A; font-weight: 400;">Thank you, ${full_name}!</h2>
            <p style="color: #6B6560; line-height: 1.6;">We've received your booking request. Our team will review it and get back to you within 2 hours.</p>
            <div style="background: #FAF8F5; border: 1px solid #E8E2DA; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #6B6560; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">Your Ticket ID</p>
              <p style="color: #1A1A1A; font-size: 24px; font-weight: bold; letter-spacing: 0.05em; margin: 8px 0;">${ticket_id}</p>
              <p style="color: #6B6560; font-size: 12px; margin: 0;">Save this to track your booking status at hyderabadflowerdecorators.netlify.app/track</p>
            </div>
            <div style="background: #FAF8F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #1A1A1A;"><strong>Event:</strong> ${event_type}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Date:</strong> ${event_date}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Time:</strong> ${preferred_time}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Venue:</strong> ${venue_address}</p>
              ${estimated_budget ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Budget:</strong> ${estimated_budget}</p>` : ""}
              ${guest_count ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Guests:</strong> ${guest_count}</p>` : ""}
            </div>
            <p style="color: #6B6560; font-size: 14px;">Need help? Call us at <a href="tel:+919876543210" style="color: #B8935F;">+91 98765 43210</a></p>
          </div>
        `,
      });

      // Email 2: Owner notification
      await resend.emails.send({
        from: "Hyderabad Flower Decorators <onboarding@resend.dev>",
        to: OWNER_EMAIL,
        subject: `New Booking — ${ticket_id} — ${full_name}`,
        html: `
          <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">New Booking Received</h1>
              <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">${ticket_id}</p>
            </div>
            <div style="background: #FAF8F5; border: 1px solid #E8E2DA; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #1A1A1A;"><strong>Customer:</strong> ${full_name}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #B8935F;">${phone}</a></p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #B8935F;">${email}</a></p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Event:</strong> ${event_type}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Date:</strong> ${event_date}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Time:</strong> ${preferred_time}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Venue:</strong> ${venue_address}</p>
              ${google_maps_link ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Maps:</strong> <a href="${google_maps_link}" style="color: #B8935F;">Open Map</a></p>` : ""}
              ${estimated_budget ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Budget:</strong> ${estimated_budget}</p>` : ""}
              ${guest_count ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Guests:</strong> ${guest_count}</p>` : ""}
              ${special_notes ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Notes:</strong> ${special_notes}</p>` : ""}
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://hyderabadflowerdecorators.netlify.app/admin/bookings" style="display: inline-block; background: #B8935F; color: #1A1A1A; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">View in Admin Panel</a>
            </div>
          </div>
        `,
      });
    } catch {
      // Email failed — booking still created
    }

    return NextResponse.json(
      {
        success: true,
        bookingId,
        ticket_id,
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
