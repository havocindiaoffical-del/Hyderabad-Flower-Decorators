import { NextRequest, NextResponse } from "next/server";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/db-helpers";
import { maskApiKey } from "@/lib/brevo-email";

const FIREBASE_API_KEY = "AIzaSyCoGmQHQWxqWfA5ceKHYF6BZ5yy_8a1G60";

const ADMIN_EMAILS = [
  "info@hydflowerdecorators.com",
  "hydflowerdecorators@gmail.com",
  "nanid9404@gmail.com",
  "Jaswanthkaioken@gmail.com",
  "hyderabadflowerdecorators@outlook.com",
];

async function verifyAdminToken(authHeader: string): Promise<{ email: string } | null> {
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const users = data.users;
    if (!users || users.length === 0) return null;

    const email = users[0].email;
    if (!ADMIN_EMAILS.includes(email)) return null;

    return { email };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const settings = await getBusinessSettings();
    // Mask the Brevo API key in GET responses so it's never exposed fully
    if (settings) {
      settings.brevo_api_key = maskApiKey(settings.brevo_api_key || "");
    }
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Verify admin auth token
  const authHeader = request.headers.get("Authorization") || "";
  const admin = await verifyAdminToken(authHeader);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized — please log in as admin to save settings" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();

    // If brevo_api_key is the masked value (starts with ****), don't update it — keep the existing one
    if (data.brevo_api_key && data.brevo_api_key.startsWith("****")) {
      const existingSettings = await getBusinessSettings();
      data.brevo_api_key = existingSettings?.brevo_api_key || "";
    }

    await saveBusinessSettings(data);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
