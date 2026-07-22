import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { businessSettings } from "@/lib/schema";

// Seed endpoint: ensures the business_settings row exists
// Call POST /api/seed once after deployment
// Brevo config is read from BREVO_API_KEY and BREVO_SENDER_EMAIL env vars (set on Netlify)
export async function POST() {
  const envApiKey = process.env.BREVO_API_KEY || "";
  const envSenderEmail = process.env.BREVO_SENDER_EMAIL || "hydflowerdecorators@gmail.com";

  try {
    const existing = await getDb().select({ id: businessSettings.id }).from(businessSettings).limit(1);

    if (existing.length === 0) {
      await getDb().insert(businessSettings).values({
        businessName: "Hyderabad Flower Decorators",
        phone: "+91 98765 43210",
        email: "info@hydflowerdecorators.com",
        whatsapp: "+91 98765 43210",
        address: "Hyderabad, Telangana, India",
        brandColor: "#B8935F",
        brevoApiKey: envApiKey,
        brevoSenderEmail: envSenderEmail,
        siteContent: {},
      });

      return NextResponse.json({
        success: true,
        message: "Settings row created",
        brevoApiKey: envApiKey ? "set from env" : "not set — add BREVO_API_KEY env var on Netlify",
        brevoSenderEmail: envSenderEmail,
      });
    }

    // Settings row exists — ensure Brevo config is set if empty
    const current = await getDb().select({
      id: businessSettings.id,
      brevoApiKey: businessSettings.brevoApiKey,
      brevoSenderEmail: businessSettings.brevoSenderEmail,
    }).from(businessSettings).limit(1);

    if (!current[0].brevoApiKey && envApiKey) {
      await getDb().update(businessSettings).set({
        brevoApiKey: envApiKey,
        brevoSenderEmail: envSenderEmail,
      }).where(eq(businessSettings.id, current[0].id));

      return NextResponse.json({ success: true, message: "Brevo config seeded from env vars" });
    }

    if (!current[0].brevoApiKey && !envApiKey) {
      return NextResponse.json({
        success: true,
        message: "No Brevo API key found. Set BREVO_API_KEY env var on Netlify or configure in Admin Settings.",
        brevoApiKey: "missing",
      });
    }

    return NextResponse.json({ success: true, message: "Brevo config already present in DB" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
