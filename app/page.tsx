import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";

// Lazy load below-fold sections for faster initial load
const Services = dynamic(() => import("@/components/home/Services"));
const GalleryPreview = dynamic(() => import("@/components/home/GalleryPreview"));
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const BookingCTA = dynamic(() => import("@/components/home/BookingCTA"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <Services />
      <GalleryPreview />
      <WhyChooseUs />
      <Testimonials />
      <BookingCTA />
      <FAQ />
    </>
  );
}
