// Shared SiteContent type — used by both admin content editor and public page components

export interface SiteContent {
  hero: { title: string; subtitle: string; description: string };
  services_title: string;
  services_subtitle: string;
  services: Array<{ id: string; title: string; desc: string; features: string[]; price: string }>;
  about_title: string;
  about_subtitle: string;
  about_description: string;
  about_values: Array<{ title: string; description: string }>;
  why_choose_title: string;
  why_choose_items: Array<{ title: string; description: string }>;
  testimonials_title: string;
  testimonials: Array<{ name: string; event_type: string; quote: string }>;
  faq_title: string;
  faq: Array<{ question: string; answer: string }>;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  contact_title: string;
  gallery_title: string;
}

export const defaultContent: SiteContent = {
  hero: {
    title: "Flowers That Make Every Moment Bloom.",
    subtitle: "Est. 2018 · Hyderabad",
    description: "Bespoke floral design for weddings, celebrations, housewarmings, and unforgettable moments across Hyderabad.",
  },
  services_title: "Our Services",
  services_subtitle: "Crafted with love",
  services: [
    { id: "housewarming", title: "Housewarming", desc: "Vibrant floral arrangements, traditional torans & elegant entrance decorations for your Griha Pravesh.", features: ["Toran & entrance decoration", "Rangoli designs", "Floral pillars", "Living room decoration", "Puja room setup", "Welcome board"], price: "₹2,000 — ₹25,000" },
    { id: "wedding", title: "Wedding", desc: "Grand floral arrangements, mandap decoration & complete venue transformation.", features: ["Mandap decoration", "Floral arches", "Table centerpieces", "Entrance decor", "Bridal bouquet", "Stage decoration"], price: "₹15,000 — ₹2,00,000" },
    { id: "baby-shower", title: "Baby Shower", desc: "Adorable themed decorations, balloon arrangements & photo booths.", features: ["Themed balloon arches", "Photo booth setups", "Cake table decoration", "Welcome board design", "Centerpiece arrangements", "Cradle & crib decoration"], price: "₹3,000 — ₹15,000" },
    { id: "pooja", title: "Pooja Decoration", desc: "Sacred and serene decorations for all religious ceremonies.", features: ["Puja mandap decoration", "Floral garlands & malas", "Rangoli designs", "Deity decoration", "Sacred entrance torans", "Havan kund decoration"], price: "₹1,500 — ₹10,000" },
    { id: "corporate", title: "Corporate Event", desc: "Professional floral design for office events & celebrations.", features: ["Conference table decor", "Entrance floral display", "Branded flower arrangements", "Lounge area decoration", "Photo wall setup", "Award ceremony decor"], price: "₹5,000 — ₹50,000" },
    { id: "custom", title: "Custom Decoration", desc: "Tell us your vision — we'll create something extraordinary.", features: ["Custom theme design", "Flexible budgets", "Any occasion", "Personal consultation", "3D mockup preview", "Full venue transformation"], price: "₹1,000 — ₹1,00,000+" },
  ],
  about_title: "Where passion meets creativity",
  about_subtitle: "Our Story",
  about_description: "Founded in the heart of Hyderabad, we bring together traditional Indian floral artistry with modern design sensibilities. Every petal, every arrangement, every decoration is crafted with love and an unwavering commitment to making your celebration unforgettable.",
  about_values: [
    { title: "Artistry", description: "Every arrangement is a masterpiece — blending traditional Indian motifs with contemporary elegance." },
    { title: "Quality", description: "We source the freshest flowers from local growers, ensuring vibrant colors and lasting beauty." },
    { title: "Personalization", description: "No two celebrations are the same. We listen, understand, and create decorations that tell your story." },
  ],
  why_choose_title: "Why Choose Us",
  why_choose_items: [
    { title: "10+ Years Experience", description: "Deep expertise in Indian floral decoration traditions and modern trends." },
    { title: "500+ Events Decorated", description: "From intimate gatherings to grand weddings — we've handled every scale." },
    { title: "Fresh Flowers Daily", description: "Sourced from local growers for peak freshness and vibrant colors." },
    { title: "24/7 Support", description: "Our team is available round the clock for emergencies and last-minute changes." },
  ],
  testimonials_title: "What Our Clients Say",
  testimonials: [
    { name: "Priya Sharma", event_type: "Wedding", quote: "The mandap decoration was absolutely stunning — our guests couldn't stop taking photos!" },
    { name: "Rajesh Kumar", event_type: "Housewarming", quote: "They transformed our new home into a floral paradise. The toran was breathtaking." },
    { name: "Anitha Reddy", event_type: "Baby Shower", quote: "From balloon arches to the photo booth — every detail was perfect and personal." },
  ],
  faq_title: "Frequently Asked Questions",
  faq: [
    { question: "How do I book a decoration?", answer: "Simply fill out our booking form with your event details. We'll review it and confirm within 2 hours." },
    { question: "What's the minimum budget?", answer: "Our packages start from ₹1,500 for basic pooja decoration. Custom packages are available for any budget." },
    { question: "Can I cancel or reschedule?", answer: "Yes! You can cancel or reschedule from our track page anytime for pending/confirmed bookings." },
    { question: "Do you provide setup and teardown?", answer: "Yes, our team handles complete setup before the event and teardown afterward." },
  ],
  cta_title: "Ready to celebrate?",
  cta_subtitle: "Let us turn your event into a floral masterpiece",
  cta_button_text: "Book Your Decoration",
  contact_title: "Get in Touch",
  gallery_title: "Our Gallery",
};
