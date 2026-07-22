import { NextRequest, NextResponse } from "next/server";
import { getBookingByTicketId, updateBookingStatus } from "@/lib/db-helpers";
import { sendCustomerConfirmation, sendOwnerNotification } from "@/lib/brevo-email";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticket_id, action, new_date, new_time, reason } = body;

    if (!ticket_id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const booking = await getBookingByTicketId(ticket_id.toUpperCase());
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow changes if booking is pending or confirmed
    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return NextResponse.json({ error: "Cannot modify a booking that is already in progress, completed, or cancelled" }, { status: 400 });
    }

    if (action === "cancel") {
      // Cancel the booking
      await updateBookingStatus(booking.id!, "cancelled", reason ? `Customer cancellation: ${reason}` : "Cancelled by customer");

      // Send cancellation notification emails (both customer + owner in parallel)
      try {
        await Promise.all([
          sendCustomerConfirmation({
            full_name: booking.full_name,
            phone: booking.phone,
            email: booking.email,
            event_type: booking.event_type,
            event_date: booking.event_date,
            preferred_time: booking.preferred_time,
            venue_address: booking.venue_address,
            google_maps_link: booking.google_maps_link,
            estimated_budget: booking.estimated_budget,
            guest_count: booking.guest_count,
            special_notes: booking.special_notes,
            ticket_id: booking.ticket_id,
          }),
          sendOwnerNotification({
            full_name: booking.full_name,
            phone: booking.phone,
            email: booking.email,
            event_type: booking.event_type,
            event_date: booking.event_date,
            preferred_time: booking.preferred_time,
            venue_address: booking.venue_address,
            google_maps_link: booking.google_maps_link,
            estimated_budget: booking.estimated_budget,
            guest_count: booking.guest_count,
            special_notes: booking.special_notes,
            ticket_id: booking.ticket_id,
            image_count: booking.image_share_urls?.length || 0,
            zip_url: booking.zip_url || "",
          }),
        ]);
      } catch {}

      return NextResponse.json({ success: true, message: "Booking cancelled successfully", status: "cancelled" });
    }

    if (action === "reschedule") {
      if (!new_date) {
        return NextResponse.json({ error: "New date is required for rescheduling" }, { status: 400 });
      }

      // Validate new date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newDateObj = new Date(new_date);
      newDateObj.setHours(0, 0, 0, 0);
      if (newDateObj < today) {
        return NextResponse.json({ error: "Cannot reschedule to a past date" }, { status: 400 });
      }

      // Update the booking with new date/time and add a note about the reschedule
      const adminNote = reason
        ? `Customer reschedule request: ${booking.event_date} → ${new_date}${new_time ? ` at ${new_time}` : ""}. Reason: ${reason}`
        : `Customer reschedule request: ${booking.event_date} → ${new_date}${new_time ? ` at ${new_time}` : ""}`;

      // Update via direct DB operation since we need to change event_date too
      const { getDb } = await import("@/lib/db");
      const { bookings } = await import("@/lib/schema");
      const { eq } = await import("drizzle-orm");

      await getDb().update(bookings).set({
        eventDate: new_date,
        preferredTime: new_time || booking.preferred_time,
        previousStatus: booking.status,
        adminNotes: adminNote,
        updatedAt: new Date(),
      }).where(eq(bookings.id, Number(booking.id)));

      return NextResponse.json({
        success: true,
        message: "Reschedule request submitted. The admin will review and confirm your new date.",
        new_date,
        new_time: new_time || booking.preferred_time,
      });
    }

    return NextResponse.json({ error: "Invalid action. Use 'cancel' or 'reschedule'" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
