"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  { q: "What types of events do you decorate for?", a: "We specialize in all types — housewarming, weddings, baby showers, pooja, corporate events, and custom themed events. Whatever the occasion, we create beautiful floral arrangements." },
  { q: "How far in advance should I book?", a: "1-2 weeks for most events, 3-4 weeks for weddings. We also accommodate last-minute requests when possible." },
  { q: "Do you provide the flowers?", a: "We handle everything — from sourcing the freshest flowers to arranging them at your venue. You just share your vision." },
  { q: "What areas do you serve?", a: "All areas across Hyderabad and Secunderabad. Additional transport charges may apply outside the city." },
  { q: "Can I show reference images?", a: "Absolutely! Share Pinterest boards, Instagram photos, or any inspiration. We match references and add our professional touch." },
  { q: "What is the pricing?", a: "Packages start from ₹5,000. Contact us for a customized quote — we work within your budget." },
  { q: "Do you offer setup and teardown?", a: "Complete setup before and teardown after. Our team arrives well in advance." },
  { q: "Cancellation policy?", a: "Cancellations 48+ hours before receive a full refund. Rescheduling is flexible." },
];

export default function FAQ() {
  return (
    <section className="py-32 bg-cream" id="faq">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="label-uppercase text-gold mb-4 block">FAQ</span>
          <h2 className="heading-section text-charcoal">Common <em className="font-serif text-gold">questions</em></h2>
        </motion.div>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-heading text-charcoal">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-stone">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
