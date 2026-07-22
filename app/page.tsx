import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";

// Lazy load below-fold sections for faster initial load
const FloralJourney = dynamic(() => import("@/components/floral/FloralJourneyWrapper"));
const SectionFloralTransition = dynamic(() => import("@/components/floral/FloralAnimations").then(m => ({ default: m.SectionFloralTransition })));
const FloatingPetals = dynamic(() => import("@/components/floral/FloralAnimations").then(m => ({ default: m.FloatingPetals })));
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
      <FloatingPetals count={4} />
      <SectionFloralTransition variant="services-occasions" />
      <WhyChooseUs />
      <SectionFloralTransition variant="occasions-garlands" />
      <GalleryPreview />
      <FloatingPetals count={3} />
      <SectionFloralTransition variant="garlands-gallery" />
      <Testimonials />
      <SectionFloralTransition variant="gallery-booking" />
      <BookingCTA />
      <FloatingPetals count={5} />
      <FAQ />
      <FloralJourney />
    </>
  );
}
