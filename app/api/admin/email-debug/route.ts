import { NextResponse } from "next/server";
import { getBrevoConfig } from "@/lib/db-helpers";

export async function GET() {
  try {
    const dbConfig = await getBrevoConfig();
    const envApiKey = process.env.BREVO_API_KEY || "";
    const envSenderEmail = process.env.BREVO_SENDER_EMAIL || "";

    const apiKey = dbConfig.apiKey || envApiKey;
    const senderEmail = dbConfig.senderEmail || envSenderEmail;
    const configSource = dbConfig.apiKey ? "db" : (envApiKey ? "env" : "none");

    // Mask API key for security
    const maskedKey = apiKey ? "****" + apiKey.slice(-6) : "NOT SET";

    // Test Brevo API with a simple request to check if the key works
    // Use the /user endpoint to verify the API key is valid
    let apiStatus = "unknown";
    let apiMessage = "";
    let statusCode = 0;

    if (apiKey) {
      try {
        const response = await fetch("https://api.brevo.com/v3/user", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "api-key": apiKey,
          },
        });
        statusCode = response.status;

        if (response.ok) {
          const data = await response.json();
          apiStatus = "valid";
          apiMessage = `Account: ${data.email || "unknown"} — API key works`;
        } else {
          const errorBody = await response.text();
          apiStatus = "invalid";
          try {
            const parsed = JSON.parse(errorBody);
            apiMessage = parsed.message || errorBody;
          } catch {
            apiMessage = errorBody;
          }
        }
      } catch (err) {
        apiStatus = "error";
        apiMessage = err instanceof Error ? err.message : "Network error";
      }
    } else {
      apiStatus = "missing";
      apiMessage = "No Brevo API key configured";
    }

    // Check sender email verification status
    let senderStatus = "unknown";
    let senderMessage = "";

    if (apiKey) {
      try {
        const response = await fetch("https://api.brevo.com/v3/senders?limit=50", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "api-key": apiKey,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const senders = data.senders || [];
          const matchingSender = senders.find((s: { email: string }) => s.email === senderEmail);

          if (matchingSender) {
            senderStatus = matchingSender.active ? "verified" : "not_verified";
            senderMessage = `Sender "${senderEmail}" found. Active: ${matchingSender.active}`;
          } else {
            senderStatus = "not_found";
            senderMessage = `Sender "${senderEmail}" NOT found in Brevo senders list. You must verify it in Brevo dashboard → Settings → Senders`;
          }

          // List all available senders for reference
          const availableSenders = senders.map((s: { email: string; active: boolean }) => `${s.email} (${s.active ? "verified" : "unverified"})`).join(", ");
          senderMessage += `. Available senders: ${availableSenders || "none"}`;
        } else {
          senderStatus = "error";
          senderMessage = `Could not check senders (status ${response.status})`;
        }
      } catch (err) {
        senderStatus = "error";
        senderMessage = err instanceof Error ? err.message : "Network error";
      }
    }

    // Now try to actually SEND a test email to the owner
    let testEmailStatus = "not_attempted";
    let testEmailMessage = "";

    if (apiKey && senderEmail) {
      try {
        const testHtml = `
          <div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 20px; text-align: center;">
            <h1 style="font-size: 20px; color: #B8935F;">HFD Email Debug Test</h1>
            <p style="color: #6B6560;">This is a diagnostic test email sent at ${new Date().toISOString()}</p>
            <p style="color: #6B6560; font-size: 12px;">Source: ${configSource} | Sender: ${senderEmail}</p>
          </div>
        `;

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: "HFD Debug", email: senderEmail },
            to: [{ email: "nanid9404@gmail.com", name: "HFD Owner" }],
            subject: "HFD — Debug Email Test " + new Date().toLocaleTimeString(),
            htmlContent: testHtml,
          }),
        });

        const responseBody = await response.text();

        if (response.ok || response.status === 201) {
          testEmailStatus = "sent";
          testEmailMessage = `Brevo accepted (status ${response.status}). Response: ${responseBody || "empty (normal)"}`;
        } else {
          testEmailStatus = "failed";
          testEmailMessage = `Brevo rejected (status ${response.status}). Response: ${responseBody}`;
        }
      } catch (err) {
        testEmailStatus = "error";
        testEmailMessage = err instanceof Error ? err.message : "Network error";
      }
    }

    return NextResponse.json({
      config: {
        source: configSource,
        apiKeyMasked: maskedKey,
        senderEmail,
        dbApiKey: dbConfig.apiKey ? "present" : "empty",
        dbSenderEmail: dbConfig.senderEmail || "empty",
        envApiKeySet: envApiKey ? "yes" : "no",
        envSenderEmailSet: envSenderEmail ? "yes" : "no",
      },
      apiCheck: {
        status: apiStatus,
        message: apiMessage,
        statusCode,
      },
      senderCheck: {
        status: senderStatus,
        message: senderMessage,
      },
      testEmail: {
        status: testEmailStatus,
        message: testEmailMessage,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Debug failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
