import { getBrevoConfig } from "./db-helpers";

interface BrevoEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
}

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BUSINESS_NAME = "Hyderabad Flower Decorators";
const OWNER_EMAIL = "nanid9404@gmail.com";

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return key ? "****" : "";
  return "****" + key.slice(-4);
}

async function getEffectiveBrevoConfig(): Promise<{ apiKey: string; senderEmail: string }> {
  // Primary: read from DB (admin can change via settings page)
  const dbConfig = await getBrevoConfig();

  // Fallback: read env vars at RUNTIME (not module-import time)
  // This is critical — Netlify env vars are only available at runtime, not during build
  const envApiKey = process.env.BREVO_API_KEY || "";
  const envSenderEmail = process.env.BREVO_SENDER_EMAIL || "hyderabadflowerdecorators@outlook.com";

  const apiKey = dbConfig.apiKey || envApiKey;
  const senderEmail = dbConfig.senderEmail || envSenderEmail;

  return { apiKey, senderEmail };
}

async function sendViaBrevo(apiKey: string, senderEmail: string, params: BrevoEmailParams): Promise<{ success: boolean; error?: string; statusCode?: number }> {
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
      } catch {}
      return { success: false, error: errorMessage, statusCode: response.status };
    }

    // Brevo returns 201 on success
    return { success: true, statusCode: response.status };
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
}): Promise<{ customerEmailSent: boolean; ownerEmailSent: boolean; errors: string[]; configSource: string }> {
  const config = await getEffectiveBrevoConfig();

  let configSource = "db";
  if (!config.apiKey) {
    return {
      customerEmailSent: false,
      ownerEmailSent: false,
      errors: ["No Brevo API key found. Configure it in Admin Settings or set BREVO_API_KEY env var on Netlify."],
      configSource: "none",
    };
  }

  // Check if the effective API key came from env vars (not DB)
  const envApiKey = process.env.BREVO_API_KEY || "";
  if (config.apiKey === envApiKey && envApiKey) {
    configSource = "env";
  }

  if (!config.senderEmail) {
    return {
      customerEmailSent: false,
      ownerEmailSent: false,
      errors: ["No Brevo sender email found. Set it in Admin Settings or set BREVO_SENDER_EMAIL env var. The sender email must be verified in Brevo dashboard → Settings → Senders."],
      configSource,
    };
  }

  const errors: string[] = [];
  let customerEmailSent = false;
  let ownerEmailSent = false;

  // ─── Email 1: Customer confirmation with COPYABLE ticket ID ────

  const customerHtml = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; color: #1A1A1A; font-weight: 300;">HFD</h1>
        <p style="color: #B8935F; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Hyderabad Flower Decorators</p>
      </div>
      <h2 style="color: #1A1A1A; font-weight: 400;">Thank you, ${bookingData.full_name}!</h2>
      <p style="color: #6B6560; line-height: 1.6;">We've received your booking request. Our team will review it and get back to you within 2 hours.</p>

      <!-- COPYABLE TICKET ID BOX -->
      <div style="background: #FAF8F5; border: 2px solid #E8E2DA; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="color: #6B6560; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px 0;">Your Booking Ticket ID</p>
        <div style="background: #1A1A1A; color: #FAF8F5; font-size: 22px; font-weight: bold; letter-spacing: 0.08em; padding: 14px 20px; border-radius: 8px; font-family: monospace, Consolas, 'Courier New', Courier; margin: 0 auto; display: inline-block;">
          ${bookingData.ticket_id}
        </div>
        <p style="color: #9B9490; font-size: 11px; margin: 12px 0 0 0;">⬆ Copy this ID above to track your booking</p>
        <p style="color: #6B6560; font-size: 12px; margin: 8px 0 0 0;">Track your booking anytime at <a href="https://hyderabadflowerdecorators.netlify.app/track" style="color: #B8935F; text-decoration: underline;">hyderabadflowerdecorators.netlify.app/track</a></p>
      </div>

      <div style="background: #FAF8F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; font-size: 14px; color: #1A1A1A;">
          <tr><td style="padding: 6px 0; color: #6B6560; width: 40%;">Event</td><td style="padding: 6px 0; font-weight: 500; text-transform: capitalize;">${bookingData.event_type.replace(/-/g, " ")}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Date</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.event_date}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Time</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.preferred_time}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Venue</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.venue_address}</td></tr>
          ${bookingData.estimated_budget ? `<tr><td style="padding: 6px 0; color: #6B6560;">Budget</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.estimated_budget}</td></tr>` : ""}
          ${bookingData.guest_count ? `<tr><td style="padding: 6px 0; color: #6B6560;">Guests</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.guest_count}</td></tr>` : ""}
        </table>
      </div>

      <div style="border-top: 1px solid #E8E2DA; padding-top: 16px; margin-top: 16px;">
        <p style="color: #6B6560; font-size: 13px;">Need help? Call us at <a href="tel:+919876543210" style="color: #B8935F;">+91 98765 43210</a> or WhatsApp anytime.</p>
        <p style="color: #9B9490; font-size: 11px; margin-top: 8px;">Hyderabad Flower Decorators • Hyderabad, Telangana, India</p>
      </div>
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
    errors.push(`Customer email failed: ${customerResult.error} (status: ${customerResult.statusCode || "N/A"})`);
  }

  // ─── Email 2: Owner notification ────────────────────────────────

  const ownerHtml = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #B8935F; color: #1A1A1A; display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600;">New Booking</div>
      </div>
      <h2 style="color: #1A1A1A; font-weight: 500; font-size: 18px;">A new booking has been submitted!</h2>

      <div style="background: #1A1A1A; color: #B8935F; font-size: 18px; font-weight: bold; letter-spacing: 0.08em; padding: 12px 20px; border-radius: 8px; text-align: center; font-family: monospace; margin: 16px 0;">
        ${bookingData.ticket_id}
      </div>

      <div style="background: #FAF8F5; border: 1px solid #E8E2DA; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; font-size: 14px; color: #1A1A1A;">
          <tr><td style="padding: 6px 0; color: #6B6560; width: 35%;">Customer</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.full_name}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Phone</td><td style="padding: 6px 0;"><a href="tel:${bookingData.phone}" style="color: #B8935F; font-weight: 500;">${bookingData.phone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Email</td><td style="padding: 6px 0;"><a href="mailto:${bookingData.email}" style="color: #B8935F; font-weight: 500;">${bookingData.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Event</td><td style="padding: 6px 0; font-weight: 500; text-transform: capitalize;">${bookingData.event_type.replace(/-/g, " ")}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Date</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.event_date}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Time</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.preferred_time}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6560;">Venue</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.venue_address}</td></tr>
          ${bookingData.google_maps_link ? `<tr><td style="padding: 6px 0; color: #6B6560;">Maps</td><td style="padding: 6px 0;"><a href="${bookingData.google_maps_link}" style="color: #B8935F;">Open Map →</a></td></tr>` : ""}
          ${bookingData.estimated_budget ? `<tr><td style="padding: 6px 0; color: #6B6560;">Budget</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.estimated_budget}</td></tr>` : ""}
          ${bookingData.guest_count ? `<tr><td style="padding: 6px 0; color: #6B6560;">Guests</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.guest_count}</td></tr>` : ""}
          ${bookingData.special_notes ? `<tr><td style="padding: 6px 0; color: #6B6560;">Notes</td><td style="padding: 6px 0; font-weight: 500;">${bookingData.special_notes}</td></tr>` : ""}
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://hyderabadflowerdecorators.netlify.app/admin/bookings" style="display: inline-block; background: #B8935F; color: #1A1A1A; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">View in Admin Panel →</a>
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
    errors.push(`Owner email failed: ${ownerResult.error} (status: ${ownerResult.statusCode || "N/A"})`);
  }

  return { customerEmailSent, ownerEmailSent, errors, configSource };
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
    subject: "HFD — Brevo Connection Test ✅",
    htmlContent: testHtml,
  });

  if (result.success) {
    return { success: true, message: `Test email sent successfully to ${testRecipientEmail}. Check your inbox (and spam folder).` };
  }
  return { success: false, message: result.error || "Unknown error" };
}

export { maskApiKey, getEffectiveBrevoConfig };
