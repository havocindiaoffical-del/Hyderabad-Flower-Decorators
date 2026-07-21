import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/firestore-helpers";
import { uploadBookingImage } from "@/lib/firebase-storage";

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

    // Validate required fields
    if (!full_name || !phone || !email || !event_type || !event_date || !preferred_time || !venue_address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
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
          // Continue even if one image fails
        }
      }
    }

    // Create booking in Firestore
    const bookingId = await createBooking({
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
    });

    // Send email notifications (if Resend is configured)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Customer confirmation
      await resend.emails.send({
        from: "Hyderabad Flower Decorators <onboarding@resend.dev>",
        to: email,
        subject: "Booking Request Received — Hyderabad Flower Decorators",
        html: `
          <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">HFD</h1>
              <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Hyderabad Flower Decorators</p>
            </div>
            <h2 style="color: #1A1A1A; font-weight: 400;">Thank you, ${full_name}!</h2>
            <p style="color: #6B6560; line-height: 1.6;">We've received your booking request. Our team will review it and get back to you within 2 hours with a personalized quote.</p>
            <div style="background: #FAF8F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #1A1A1A;"><strong>Event:</strong> ${event_type}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Date:</strong> ${event_date}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Time:</strong> ${preferred_time}</p>
              <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Venue:</strong> ${venue_address}</p>
            </div>
            <p style="color: #6B6560; font-size: 14px;">Need immediate assistance? Call us at <a href="tel:+919876543210" style="color: #B8935F;">+91 98765 43210</a></p>
          </div>
        `,
      });

      // Business notification
      const businessEmail = process.env.BUSINESS_EMAIL || "info@hydflowerdecorators.com";
      await resend.emails.send({
        from: "HFD Booking <onboarding@resend.dev>",
        to: businessEmail,
        subject: `New Booking: ${event_type} — ${full_name}`,
        html: `
          <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1A1A1A;">New Booking Request</h2>
            <div style="background: #FAF8F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Name:</strong> ${full_name}</p>
              <p style="margin: 8px 0 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 8px 0 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0 0;"><strong>Event:</strong> ${event_type}</p>
              <p style="margin: 8px 0 0;"><strong>Date:</strong> ${event_date}</p>
              <p style="margin: 8px 0 0;"><strong>Time:</strong> ${preferred_time}</p>
              <p style="margin: 8px 0 0;"><strong>Venue:</strong> ${venue_address}</p>
              ${estimated_budget ? `<p style="margin: 8px 0 0;"><strong>Budget:</strong> ${estimated_budget}</p>` : ""}
              ${guest_count ? `<p style="margin: 8px 0 0;"><strong>Guests:</strong> ${guest_count}</p>` : ""}
              ${special_notes ? `<p style="margin: 8px 0 0;"><strong>Notes:</strong> ${special_notes}</p>` : ""}
              ${imageUrls.length > 0 ? `<p style="margin: 8px 0 0;"><strong>Images:</strong> ${imageUrls.length} reference image(s)</p>` : ""}
            </div>
            <p style="color: #B8935F;">Booking ID: ${bookingId}</p>
          </div>
        `,
      });
    } catch {
      // Email sending failed, but booking was created
    }

    return NextResponse.json(
      { success: true, bookingId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
