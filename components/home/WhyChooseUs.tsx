"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flower2, Copy, IndianRupee, Users, Headphones } from "lucide-react";

const reasons = [
  { icon: Flower2, title: "Fresh Flowers", desc: "Sourced daily to ensure every arrangement looks stunning and lasts longer." },
  { icon: Copy, title: "Reference Matching", desc: "Show us your inspiration — we'll recreate it perfectly, then elevate it." },
  { icon: IndianRupee, title: "Honest Pricing", desc: "Premium quality at transparent prices. No hidden costs, ever." },
  { icon: Users, title: "Professional Team", desc: "Experienced decorators with years of expertise and creative vision." },
  { icon: Headphones, title: "24×7 Support", desc: "Around the clock availability for consultations and last-minute changes." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-ivory relative overflow-hidden" id="why-us">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[150px]" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left — large editorial */}
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="label-uppercase text-gold mb-4 block">Why Us</span>
              <h2 className="heading-section text-charcoal">
                Your celebration,<br />
                <em className="font-serif text-gold">our obsession</em>
              </h2>
              <p className="mt-8 text-stone font-light leading-relaxed max-w-md">
                We don't just decorate events — we create experiences. With meticulous attention to detail and a team that cares, we ensure every celebration is picture-perfect.
              </p>
              <div className="mt-12 p-8 bg-cream rounded-2xl border border-border-light">
                <p className="font-serif text-xl text-charcoal leading-relaxed italic">
                  "The best flower decoration service in Hyderabad. They turned our wedding into a fairytale."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center"><span className="text-gold text-xs font-serif">PR</span></div>
                  <div>
                    <p className="text-sm text-charcoal font-heading font-medium">Priya & Ramesh</p>
                    <p className="text-xs text-stone font-body">Wedding, 2024</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — reasons */}
          <div className="lg:col-span-6 lg:col-start-7">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div key={r.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-start gap-6 py-7 border-b border-border-light group last:border-0">
                  <div className="w-12 h-12 rounded-full border border-border-light flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                    <Icon className="w-5 h-5 text-gold group-hover:text-ivory transition-colors duration-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-charcoal text-base mb-1">{r.title}</h3>
                    <p className="text-sm text-stone leading-relaxed font-light">{r.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
