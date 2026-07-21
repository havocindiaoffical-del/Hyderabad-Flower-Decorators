import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import Services from "@/components/home/Services";
import GalleryPreview from "@/components/home/GalleryPreview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import BookingCTA from "@/components/home/BookingCTA";
import FAQ from "@/components/home/FAQ";

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
