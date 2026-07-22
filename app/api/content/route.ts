import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { businessSettings } from "@/lib/schema";
import { defaultContent } from "@/lib/site-content-types";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await getDb().select({ siteContent: businessSettings.siteContent }).from(businessSettings).limit(1);
    if (result.length > 0 && result[0].siteContent) {
      const saved = result[0].siteContent as Record<string, unknown>;
      // Merge saved content with defaults — ensures partial saves still work
      const merged = { ...defaultContent, ...saved };
      // Deep merge nested objects (hero, etc.)
      if (saved.hero && typeof saved.hero === "object") {
        merged.hero = { ...defaultContent.hero, ...saved.hero };
      }
      return NextResponse.json({ content: merged });
    }
    return NextResponse.json({ content: defaultContent });
  } catch {
    // DB not available — return defaults so the site still works
    return NextResponse.json({ content: defaultContent });
  }
}
