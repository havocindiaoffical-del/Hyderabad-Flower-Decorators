import type { Metadata } from "next";
import BookingPageContent from "@/components/features/BookingPageContent";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book your flower decoration appointment with Hyderabad Flower Decorators. Choose your event type, date, and preferences. Free consultation!",
};

export default function BookPage() {
  return <BookingPageContent />;
}
