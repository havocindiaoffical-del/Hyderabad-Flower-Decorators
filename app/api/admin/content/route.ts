import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

const FIREBASE_API_KEY = "AIzaSyCoGmQHQWxqWfA5ceKHYF6BZ5yy_8a1G60";
const ADMIN_EMAILS = ["info@hydflowerdecorators.com", "hydflowerdecorators@gmail.com", "nanid9404@gmail.com", "Jaswanthkaioken@gmail.com"];

async function verifyAdminToken(authHeader: string): Promise<{ email: string } | null> {
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${FIREBASE_API_KEY}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const users = data.users;
    if (!users || users.length === 0) return null;
    const email = users[0].email;
    if (!ADMIN_EMAILS.includes(email)) return null;
    return { email };
  } catch { return null; }
}

export async function GET() {
  try {
    const result = await getDb().select({ siteContent: businessSettings.siteContent }).from(businessSettings).limit(1);
    const content = result[0]?.siteContent || {};
    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization") || "";
  const admin = await verifyAdminToken(authHeader);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content } = await request.json();
    const existing = await getDb().select({ id: businessSettings.id }).from(businessSettings).limit(1);
    if (existing.length > 0) {
      await getDb().update(businessSettings).set({ siteContent: content, updatedAt: new Date() }).where(eq(businessSettings.id, existing[0].id));
    } else {
      await getDb().insert(businessSettings).values({ businessName: "Hyderabad Flower Decorators", phone: "+91 98765 43210", email: "info@hydflowerdecorators.com", whatsapp: "+91 98765 43210", address: "Hyderabad, Telangana, India", siteContent: content });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
