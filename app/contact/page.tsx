import type { Metadata } from "next";
import ContactPageContent from "@/components/features/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Hyderabad Flower Decorators. Call, WhatsApp, or visit us. We're available 24/7 for your decoration needs.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
