import { getBrevoConfig } from "./db-helpers";

interface BrevoEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
}

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BUSINESS_NAME = "Hyderabad Flower Decorators";

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return key ? "****" : "";
  return "****" + key.slice(-4);
}

async function sendViaBrevo(apiKey: string, senderEmail: string, params: BrevoEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: BUSINESS_NAME,
          email: senderEmail,
        },
        to: [
          {
            email: params.toEmail,
            name: params.toName,
          },
        ],
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Brevo API error (${response.status})`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.message) errorMessage = parsed.message;
      } catch {
        // Use default error message
      }
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error contacting Brevo";
    return { success: false, error: message };
  }
}

export async function sendBookingNotifications(bookingData: {
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  google_maps_link?: string;
  estimated_budget?: string;
  guest_count?: string;
  special_notes?: string;
  ticket_id: string;
}): Promise<{ customerEmailSent: boolean; ownerEmailSent: boolean; errors: string[] }> {
  const config = await getBrevoConfig();

  if (!config.apiKey) {
    return {
      customerEmailSent: false,
      ownerEmailSent: false,
      errors: ["Brevo API key not configured. Set it in Admin Settings."],
    };
  }

  if (!config.senderEmail) {
    return {
      customerEmailSent: false,
      ownerEmailSent: false,
      errors: ["Brevo sender email not configured. Set it in Admin Settings and verify it in Brevo dashboard."],
    };
  }

  const OWNER_EMAIL = "hydflowerdecorators@gmail.com";
  const errors: string[] = [];
  let customerEmailSent = false;
  let ownerEmailSent = false;

  // Email 1: Customer confirmation
  const customerHtml = `
    <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">HFD</h1>
        <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Hyderabad Flower Decorators</p>
      </div>
      <h2 style="color: #1A1A1A; font-weight: 400;">Thank you, ${bookingData.full_name}!</h2>
      <p style="color: #6B6560; line-height: 1.6;">We've received your booking request. Our team will review it and get back to you within 2 hours.</p>
      <div style="background: #FAF8F5; border: 1px solid #E8E2DA; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="color: #6B6560; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">Your Ticket ID</p>
        <p style="color: #1A1A1A; font-size: 24px; font-weight: bold; letter-spacing: 0.05em; margin: 8px 0;">${bookingData.ticket_id}</p>
        <p style="color: #6B6560; font-size: 12px; margin: 0;">Save this to track your booking status at hyderabadflowerdecorators.netlify.app/track</p>
      </div>
      <div style="background: #FAF8F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; color: #1A1A1A;"><strong>Event:</strong> ${bookingData.event_type}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Date:</strong> ${bookingData.event_date}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Time:</strong> ${bookingData.preferred_time}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Venue:</strong> ${bookingData.venue_address}</p>
        ${bookingData.estimated_budget ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Budget:</strong> ${bookingData.estimated_budget}</p>` : ""}
        ${bookingData.guest_count ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Guests:</strong> ${bookingData.guest_count}</p>` : ""}
      </div>
      <p style="color: #6B6560; font-size: 14px;">Need help? Call us at <a href="tel:+919876543210" style="color: #B8935F;">+91 98765 43210</a></p>
    </div>
  `;

  const customerResult = await sendViaBrevo(config.apiKey, config.senderEmail, {
    toEmail: bookingData.email,
    toName: bookingData.full_name,
    subject: `Booking Confirmed — Ticket ${bookingData.ticket_id}`,
    htmlContent: customerHtml,
  });

  if (customerResult.success) {
    customerEmailSent = true;
  } else {
    errors.push(`Customer email failed: ${customerResult.error}`);
  }

  // Email 2: Owner notification
  const ownerHtml = `
    <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">New Booking Received</h1>
        <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">${bookingData.ticket_id}</p>
      </div>
      <div style="background: #FAF8F5; border: 1px solid #E8E2DA; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; color: #1A1A1A;"><strong>Customer:</strong> ${bookingData.full_name}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Phone:</strong> <a href="tel:${bookingData.phone}" style="color: #B8935F;">${bookingData.phone}</a></p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Email:</strong> <a href="mailto:${bookingData.email}" style="color: #B8935F;">${bookingData.email}</a></p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Event:</strong> ${bookingData.event_type}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Date:</strong> ${bookingData.event_date}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Time:</strong> ${bookingData.preferred_time}</p>
        <p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Venue:</strong> ${bookingData.venue_address}</p>
        ${bookingData.google_maps_link ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Maps:</strong> <a href="${bookingData.google_maps_link}" style="color: #B8935F;">Open Map</a></p>` : ""}
        ${bookingData.estimated_budget ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Budget:</strong> ${bookingData.estimated_budget}</p>` : ""}
        ${bookingData.guest_count ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Guests:</strong> ${bookingData.guest_count}</p>` : ""}
        ${bookingData.special_notes ? `<p style="margin: 8px 0 0; color: #1A1A1A;"><strong>Notes:</strong> ${bookingData.special_notes}</p>` : ""}
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://hyderabadflowerdecorators.netlify.app/admin/bookings" style="display: inline-block; background: #B8935F; color: #1A1A1A; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">View in Admin Panel</a>
      </div>
    </div>
  `;

  const ownerResult = await sendViaBrevo(config.apiKey, config.senderEmail, {
    toEmail: OWNER_EMAIL,
    toName: "HFD Owner",
    subject: `New Booking — ${bookingData.ticket_id} — ${bookingData.full_name}`,
    htmlContent: ownerHtml,
  });

  if (ownerResult.success) {
    ownerEmailSent = true;
  } else {
    errors.push(`Owner email failed: ${ownerResult.error}`);
  }

  return { customerEmailSent, ownerEmailSent, errors };
}

export async function testBrevoConnection(apiKey: string, senderEmail: string, testRecipientEmail: string): Promise<{ success: boolean; message: string }> {
  const testHtml = `
    <div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 20px; text-align: center;">
      <h1 style="font-size: 20px; color: #B8935F;">Hyderabad Flower Decorators</h1>
      <p style="color: #6B6560;">This is a test email from your Brevo configuration.</p>
      <p style="color: #6B6560; font-size: 12px;">If you received this, your email setup is working correctly!</p>
    </div>
  `;

  const result = await sendViaBrevo(apiKey, senderEmail, {
    toEmail: testRecipientEmail,
    toName: "Test Recipient",
    subject: "HFD — Brevo Connection Test",
    htmlContent: testHtml,
  });

  if (result.success) {
    return { success: true, message: `Test email sent successfully to ${testRecipientEmail}. Check your inbox (and spam folder).` };
  }
  return { success: false, message: result.error || "Unknown error" };
}

export { maskApiKey };
