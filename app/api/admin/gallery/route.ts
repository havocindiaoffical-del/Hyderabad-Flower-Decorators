import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages, addGalleryImage, toggleFeatured, deleteGalleryImage } from "@/lib/db-helpers";
import { uploadGalleryImage, deleteImage } from "@/lib/firebase-storage";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = (formData.get("title") as string)?.trim() || "";
    const category = (formData.get("category") as string)?.trim() || "";
    const file = formData.get("file") as File | null;

    if (!title || !category || !file) {
      return NextResponse.json({ error: "title, category, and file required" }, { status: 400 });
    }

    const url = await uploadGalleryImage(file);
    const id = await addGalleryImage({ url, title, category, featured: false });
    return NextResponse.json({ success: true, id, url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
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

export async function DELETE(request: NextRequest) {
  try {
    const { id, url } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    try { await deleteImage(url); } catch { /* storage delete may fail */ }
    await deleteGalleryImage(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
