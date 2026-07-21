import type { Metadata } from "next";
import ServicesPageContent from "@/components/features/ServicesPageContent";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our premium flower decoration services — weddings, housewarming, baby showers, pooja, corporate events, and custom decorations in Hyderabad.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
