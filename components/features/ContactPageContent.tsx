"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe } from "lucide-react";
import { useSiteContent } from "@/components/providers/SiteContent";

export default function ContactPageContent() {
  const { content } = useSiteContent();

  const contacts = [
    { icon: Phone, title: "Phone", value: "+91 98765 43210", href: "tel:+919876543210", desc: "Available 24/7" },
    { icon: MessageCircle, title: "WhatsApp", value: "+91 98765 43210", href: "https://wa.me/919876543210", desc: "Quick responses" },
    { icon: Mail, title: "Email", value: "info@hydflowerdecorators.com", href: "mailto:info@hydflowerdecorators.com", desc: "Detailed inquiries" },
    { icon: MapPin, title: "Location", value: "Hyderabad, Telangana", href: "https://maps.google.com/?q=Hyderabad,Telangana", desc: "All areas served" },
    { icon: Clock, title: "Hours", value: "24/7 Service", href: null, desc: "Always available" },
    { icon: Globe, title: "Social", value: "@hydflowerdecorators", href: "https://instagram.com/hydflowerdecorators", desc: "Daily inspiration" },
  ];

  return (
    <div className="pt-24 bg-ivory">
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Contact</span>
            <h1 className="heading-hero text-charcoal">{content.contact_title || "Get in touch"}</h1>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-light rounded-2xl overflow-hidden">
            {contacts.map((c, i) => { const Icon = c.icon; const W = c.href ? "a" : "div"; const lp = c.href ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: c.href.startsWith("http") ? "noopener noreferrer" : undefined } : {}; return (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <W {...lp} className="block bg-ivory p-10 hover:bg-cream transition-colors duration-300">
                  <Icon className="w-4 h-4 text-gold mb-6" />
                  <h3 className="font-heading font-semibold text-charcoal text-base mb-1">{c.title}</h3>
                  <p className="text-sm font-body text-charcoal">{c.value}</p>
                  <p className="text-xs text-warm-gray mt-2 font-body">{c.desc}</p>
                </W>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
    </div>
  );
}
