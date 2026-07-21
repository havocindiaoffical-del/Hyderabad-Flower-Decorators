import { NextRequest, NextResponse } from "next/server";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/db-helpers";

export async function GET() {
  try {
    const settings = await getBusinessSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    await saveBusinessSettings(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
