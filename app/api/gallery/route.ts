import { NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/db-helpers";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
