"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, Phone } from "lucide-react";
import { useSiteContent } from "@/components/providers/SiteContent";

// Default images mapped by service id
const serviceImages: Record<string, string> = {
  housewarming: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "baby-shower": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80",
  pooja: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80",
  corporate: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  custom: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
};

export default function ServicesPageContent() {
  const { content } = useSiteContent();

  return (
    <div className="pt-24 bg-ivory">
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">{content.services_subtitle || "Services"}</span>
            <h1 className="heading-hero text-charcoal">{content.services_title || "Our Services"}</h1>
            <p className="mt-6 text-stone font-light max-w-lg mx-auto">From intimate ceremonies to grand celebrations, tailored to your vision.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {content.services.map((s, i) => {
            const rev = i % 2 === 1;
            const img = serviceImages[s.id] || serviceImages["custom"];
            return (
              <motion.div
                key={s.id}
                id={s.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-16 lg:py-20 border-b border-border-light"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 ${rev ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`lg:col-span-6 ${rev ? "lg:col-start-7 lg:row-start-1" : ""}`}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                      <Image
                        src={img}
                        alt={s.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  <div className={`lg:col-span-5 flex flex-col justify-center ${rev ? "" : "lg:col-start-1"}`}>
                    <span className="text-gold label-uppercase mb-4">0{i + 1}</span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal italic mb-4">{s.title}</h2>
                    <p className="text-stone font-light leading-relaxed mb-8">{s.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                      {s.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-gold shrink-0" />
                          <span className="text-xs text-stone font-body">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-6">
                      <Link
                        href={`/book?event_type=${s.id}`}
                        className="group inline-flex items-center gap-2 bg-charcoal text-ivory px-6 py-3 rounded-full label-uppercase hover:bg-graphite transition-colors text-xs"
                      >
                        Enquire <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                      <span className="text-xs text-warm-gray font-body">{s.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24 bg-charcoal text-center">
        <h2 className="heading-section text-ivory mb-4">Can&apos;t find what you need?</h2>
        <p className="text-ivory/40 font-light mb-8">We love creative challenges. Tell us your vision.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book">
            <button className="bg-gold text-charcoal px-8 py-4 rounded-full label-uppercase hover:bg-gold-light transition-colors text-xs">
              Get Custom Quote
            </button>
          </Link>
          <a href="tel:+919876543210">
            <button className="border border-ivory/10 text-ivory px-8 py-4 rounded-full label-uppercase hover:border-ivory/30 transition-colors text-xs flex items-center gap-2">
              <Phone className="w-3 h-3" />Call Us
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
