"use client";

import React, { useState, useEffect, useRef } from "react";

import { Trash2, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getGalleryImages, addGalleryImage, toggleFeatured, deleteGalleryImage, type GalleryImageData,
} from "@/lib/firestore-helpers";
import { uploadGalleryImage, deleteImage } from "@/lib/firebase-storage";

const categories = ["Wedding", "Housewarming", "Baby Shower", "Pooja", "Corporate", "Custom"];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [firebaseReady, setFirebaseReady] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await getGalleryImages();
      setImages(data);
      setFirebaseReady(true);
    } catch {
      setFirebaseReady(false);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (!newTitle || !newCategory) {
      alert("Please enter a title and select a category first.");
      return;
    }

    setIsUploading(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) continue;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;

        const url = await uploadGalleryImage(file);
        await addGalleryImage({ url, title: newTitle, category: newCategory, featured: false });
      }
      setNewTitle("");
      setNewCategory("");
      fetchGallery();
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage(url);
      await deleteGalleryImage(id);
      fetchGallery();
    } catch {
      await deleteGalleryImage(id);
      fetchGallery();
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await toggleFeatured(id, featured);
      fetchGallery();
    } catch {
      // Handle error
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-gray font-body">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-charcoal">Gallery Management</h1>
        <p className="text-sm text-warm-gray font-body mt-1">Upload and manage gallery images</p>
      </div>

      {!firebaseReady && (
        <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm text-charcoal font-body">Firebase not connected. Set up Firestore and Storage to manage gallery images.</p>
        </div>
      )}

      {/* Upload Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-heading font-semibold text-charcoal mb-4">Upload New Image</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input label="Image Title" placeholder="Enter image title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div>
              <label className="block label-uppercase text-stone mb-2">Category</label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || !newTitle || !newCategory || !firebaseReady} variant="default" className="w-full gap-2">
                {isUploading ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} className="hidden" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 text-border-light mx-auto mb-4" />
          <p className="text-warm-gray font-body">{firebaseReady ? "No images uploaded yet" : "Connect Firebase to manage images"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square rounded-xl bg-cream overflow-hidden relative">
                <img src={image.url} alt={image.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFeatured(image.id!, image.featured)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${image.featured ? "bg-gold text-charcoal" : "bg-white text-charcoal"}`}
                      title={image.featured ? "Unfeature" : "Feature"}
                    >★</button>
                    <button
                      onClick={() => handleDelete(image.id!, image.url)}
                      className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center"
                      title="Delete"
                    ><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs font-body text-charcoal font-medium truncate">{image.title}</p>
              <p className="text-xs font-body text-warm-gray">{image.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
