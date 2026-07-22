"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, Upload, Image as ImageIcon, AlertCircle, Loader2, Star } from "lucide-react";
import { useAdminTheme } from "@/components/providers/AdminTheme";
import { uploadGalleryImage, deleteImage } from "@/lib/firebase-storage";

interface GalleryImageData {
  id?: string;
  url: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
}

const categories = ["Wedding", "Housewarming", "Baby Shower", "Pooja", "Corporate", "Custom"];

export default function AdminGallery() {
  const { theme } = useAdminTheme();
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [dbReady, setDbReady] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data.images || []);
      setDbReady(true);
    } catch {
      setDbReady(false);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (!newTitle || !newCategory) {
      setUploadError("Please enter a title and select a category first.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`File "${file.name}" exceeds 5MB limit.`);
          continue;
        }
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          setUploadError(`File "${file.name}" is not a supported format (JPEG, PNG, WebP only).`);
          continue;
        }

        // Step 1: Upload directly to Firebase Storage from client (uses admin auth context)
        const url = await uploadGalleryImage(file);

        // Step 2: Save metadata to database via API
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, title: newTitle, category: newCategory }),
        });

        if (!res.ok) {
          const data = await res.json();
          setUploadError(data.error || "Failed to save image to database.");
          // Clean up: try to delete the uploaded file from Firebase Storage
          try { await deleteImage(url); } catch {}
          continue;
        }
      }

      setNewTitle("");
      setNewCategory("");
      fetchGallery();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setDeletingId(id);
    try {
      // Step 1: Delete from Firebase Storage on client side (uses admin auth context)
      try { await deleteImage(url); } catch {}
      // Step 2: Delete from database
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchGallery();
    } catch {
      fetchGallery();
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured }),
      });
      fetchGallery();
    } catch { fetchGallery(); }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4" style={{ background: theme.bgPrimary }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-body" style={{ color: theme.textSecondary }}>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: theme.bgPrimary }}>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold" style={{ color: theme.textPrimary }}>Gallery Management</h1>
        <p className="text-sm font-body mt-1" style={{ color: theme.textSecondary }}>Upload and manage gallery images</p>
      </div>

      {!dbReady && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(184,147,95,0.05)", border: "1px solid rgba(184,147,95,0.2)" }}>
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm font-body" style={{ color: theme.textPrimary }}>Database connection issue. Check your database and Firebase Storage setup.</p>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-600 font-body">{uploadError}</p>
          <button onClick={() => setUploadError("")} className="ml-auto text-xs text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {/* Upload Section */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
        <h3 className="font-heading font-semibold mb-4" style={{ color: theme.textPrimary }}>Upload New Image</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Image Title</label>
            <input
              type="text"
              placeholder="Enter image title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex h-11 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold font-body"
              style={{ background: theme.bgInput, color: theme.textPrimary, borderColor: theme.borderColor }}
            />
          </div>
          <div>
            <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex h-11 w-full rounded-xl border px-4 py-3 text-sm font-body focus:outline-none focus:border-gold appearance-none"
              style={{ background: theme.bgInput, color: theme.textPrimary, borderColor: theme.borderColor }}
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !newTitle || !newCategory}
              className="w-full h-11 rounded-xl px-4 text-sm font-body font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              style={{ background: "#B8935F", color: "#1A1A1A" }}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} className="hidden" />
          </div>
        </div>
        <p className="text-xs font-body" style={{ color: theme.textMuted }}>
          Accepted formats: JPEG, PNG, WebP. Max file size: 5MB per image. Images are uploaded securely to Firebase Storage using your admin credentials.
        </p>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 mx-auto mb-4" style={{ color: theme.borderColor }} />
          <p className="font-body" style={{ color: theme.textSecondary }}>{dbReady ? "No images uploaded yet. Upload your first image above!" : "Check database connection"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square rounded-xl overflow-hidden relative" style={{ background: theme.bgHover }}>
                <img src={image.url} alt={image.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFeatured(image.id!, image.featured)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${image.featured ? "ring-2 ring-gold/50" : ""}`}
                      style={{ background: image.featured ? "#B8935F" : "#FFFFFF", color: image.featured ? "#1A1A1A" : "#1A1A1A" }}
                      title={image.featured ? "Unfeature" : "Feature"}
                    >
                      <Star className={`w-4 h-4 ${image.featured ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id!, image.url)}
                      disabled={deletingId === image.id}
                      className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center disabled:opacity-50 transition-colors"
                      title="Delete"
                    >
                      {deletingId === image.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {image.featured && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-gold text-charcoal" title="Featured">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs font-body font-medium truncate" style={{ color: theme.textPrimary }}>{image.title}</p>
              <p className="text-xs font-body" style={{ color: theme.textSecondary }}>{image.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
