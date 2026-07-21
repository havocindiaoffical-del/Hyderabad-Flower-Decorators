import type { Metadata } from "next";
import AboutPageContent from "@/components/features/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Hyderabad Flower Decorators — our story, mission, and the passionate team behind Hyderabad's most trusted decoration service.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
