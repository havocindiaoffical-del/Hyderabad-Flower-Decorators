import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages, addGalleryImage, toggleFeatured, deleteGalleryImage } from "@/lib/db-helpers";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST now accepts { url, title, category } — the image is already uploaded to Firebase Storage by the client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, category } = body;

    if (!url || !title || !category) {
      return NextResponse.json({ error: "url, title, and category required" }, { status: 400 });
    }

    const id = await addGalleryImage({ url, title, category, featured: false });
    return NextResponse.json({ success: true, id, url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add gallery image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, featured } = await request.json();
    if (!id || featured === undefined) {
      return NextResponse.json({ error: "id and featured required" }, { status: 400 });
    }
    await toggleFeatured(id, featured);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle featured";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE only removes from DB — the client already deleted the file from Firebase Storage
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await deleteGalleryImage(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
