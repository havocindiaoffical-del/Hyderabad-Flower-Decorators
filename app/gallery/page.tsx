import type { Metadata } from "next";
import GalleryPageContent from "@/components/features/GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our portfolio of stunning flower decorations and event designs. Weddings, housewarming, baby showers, and more in Hyderabad.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
