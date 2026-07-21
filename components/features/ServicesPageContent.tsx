"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, Phone } from "lucide-react";

const services = [
  {
    id: "housewarming", title: "Housewarming", desc: "Vibrant floral arrangements, traditional torans & elegant entrance decorations.",
    features: ["Traditional toran & door decorations", "Entrance floral arches", "Rangoli & flower petal designs", "Living room centerpieces", "Puja room arrangements", "Balloon & floral combos"],
    price: "₹5,000 — ₹25,000",
    img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80"
  },
  {
    id: "wedding", title: "Wedding", desc: "Stunning mandap decorations, floral arches & elaborate stage designs.",
    features: ["Mandap decoration", "Stage & backdrop design", "Floral arches & walkways", "Reception centerpieces", "Car decoration", "Guest seating accents"],
    price: "₹15,000 — ₹1,00,000+",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
  },
  {
    id: "baby-shower", title: "Baby Shower", desc: "Adorable themed decorations, balloon arrangements & photo booths.",
    features: ["Themed balloon arches", "Photo booth setups", "Cake table decoration", "Welcome board design", "Centerpiece arrangements", "Gender reveal setups"],
    price: "₹3,000 — ₹15,000",
    img: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80"
  },
  {
    id: "pooja", title: "Pooja", desc: "Sacred and serene decorations for all religious ceremonies.",
    features: ["Puja mandap decoration", "Floral garlands & malas", "Rangoli designs", "Deity decoration", "Sacred entrance torans", "Havan kund decoration"],
    price: "₹3,000 — ₹20,000",
    img: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80"
  },
  {
    id: "corporate", title: "Corporate", desc: "Professional floral decor for office inaugurations & brand activations.",
    features: ["Office inauguration decor", "Stage & podium arrangements", "Reception desk florals", "Conference centerpieces", "Branded photo walls", "Festive celebrations"],
    price: "₹10,000 — ₹50,000+",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
  },
  {
    id: "custom", title: "Custom", desc: "Unique vision? We bring your dream decorations to life.",
    features: ["Custom theme design", "Rare flower sourcing", "Personalized concepts", "Reference matching", "3D mockup previews", "End-to-end execution"],
    price: "Custom Quote",
    img: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80"
  },
];

export default function ServicesPageContent() {
  return (
    <div className="pt-24 bg-ivory">
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Services</span>
            <h1 className="heading-hero text-charcoal">Crafting beauty for <em className="font-serif text-gold not-italic">every occasion</em></h1>
            <p className="mt-6 text-stone font-light max-w-lg mx-auto">From intimate ceremonies to grand celebrations, tailored to your vision.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {services.map((s, i) => {
            const rev = i % 2 === 1;
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
                        src={s.img}
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
