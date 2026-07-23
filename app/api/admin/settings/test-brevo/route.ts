import { NextRequest, NextResponse } from "next/server";
import { getBrevoConfig } from "@/lib/db-helpers";
import { testBrevoConnection } from "@/lib/brevo-email";

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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization") || "";
  const admin = await verifyAdminToken(authHeader);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized — please log in as admin" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const apiKey = body.api_key as string;
    const senderEmail = body.sender_email as string;
    const testEmail: string = body.test_email as string || admin.email;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "Please enter your Brevo API key first" }, { status: 400 });
    }
    if (!senderEmail) {
      return NextResponse.json({ success: false, message: "Please enter the sender email (must be verified in Brevo)" }, { status: 400 });
    }

    const result = await testBrevoConnection(apiKey, senderEmail, testEmail);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Test failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
