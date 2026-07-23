import type { Metadata } from "next";
import { Suspense } from "react";
import BookingPageContent from "@/components/features/BookingPageContent";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book your flower decoration appointment with Hyderabad Flower Decorators. Choose your event type, date, and preferences. Free consultation!",
};

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 min-h-screen flex items-center justify-center bg-ivory">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
