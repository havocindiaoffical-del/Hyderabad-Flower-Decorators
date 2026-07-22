import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { businessSettings } from "@/lib/schema";

// Quick fix: update Brevo sender email to the verified one
// Call POST /api/fix-sender once to fix the sender email
export async function POST() {
  try {
    const existing = await getDb().select({ id: businessSettings.id }).from(businessSettings).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "No business_settings row found" }, { status: 404 });
    }

    const id = existing[0].id;

    await getDb().update(businessSettings).set({
      brevoSenderEmail: "hyderabadflowerdecorators@outlook.com",
    }).where(eq(businessSettings.id, id));

    return NextResponse.json({
      success: true,
      message: "Sender email updated from hydflowerdecorators@gmail.com → hyderabadflowerdecorators@outlook.com (verified in Brevo)",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
