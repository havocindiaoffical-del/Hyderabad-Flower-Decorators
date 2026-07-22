import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";

// Lazy load below-fold sections for faster initial load
// Note: FloatingPetals + ScrollFlowers are handled by GlobalFloralOverlay in the root layout,
// so we don't add them here — that would cause duplicates and stuck particles.
const SectionFloralTransition = dynamic(() => import("@/components/floral/FloralAnimations").then(m => ({ default: m.SectionFloralTransition })));
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
      <SectionFloralTransition variant="hero-services" />
      <Services />
      <SectionFloralTransition variant="services-occasions" />
      <WhyChooseUs />
      <SectionFloralTransition variant="occasions-garlands" />
      <GalleryPreview />
      <SectionFloralTransition variant="garlands-gallery" />
      <Testimonials />
      <SectionFloralTransition variant="gallery-booking" />
      <BookingCTA />
      <FAQ />
    </>
  );
}
