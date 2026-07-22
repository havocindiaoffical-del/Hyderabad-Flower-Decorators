"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useSiteContent } from "@/components/providers/SiteContent";

export default function FAQ() {
  const { content } = useSiteContent();

  return (
    <section className="py-32 bg-cream" id="faq">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="label-uppercase text-gold mb-4 block">FAQ</span>
          <h2 className="heading-section text-charcoal">{content.faq_title || "Common questions"}</h2>
        </motion.div>
        <Accordion type="single" collapsible>
          {content.faq.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-heading text-charcoal">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-stone">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
