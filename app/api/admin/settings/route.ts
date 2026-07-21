import { NextRequest, NextResponse } from "next/server";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/db-helpers";

export async function GET() {
  try {
    const settings = await getBusinessSettings();
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    await saveBusinessSettings(data);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
