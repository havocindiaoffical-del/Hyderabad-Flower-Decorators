"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const reasons = [
  { title: "Fresh Flowers", desc: "Sourced daily to ensure every arrangement looks stunning and lasts longer." },
  { title: "Reference Matching", desc: "Show us your inspiration — we'll recreate it perfectly, then elevate it." },
  { title: "Honest Pricing", desc: "Premium quality at transparent prices. No hidden costs, ever." },
  { title: "Professional Team", desc: "Experienced decorators with years of expertise and creative vision." },
  { title: "24×7 Support", desc: "Around the clock availability for consultations and last-minute changes." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-ivory relative overflow-hidden" id="why-us">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left */}
          <div className="lg:col-span-5">
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
                &ldquo;The best flower decoration service in Hyderabad. They turned our wedding into a fairytale.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center"><span className="text-gold text-xs font-serif">PR</span></div>
                <div>
                  <p className="text-sm text-charcoal font-heading font-medium">Priya & Ramesh</p>
                  <p className="text-xs text-stone font-body">Wedding, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6 lg:col-start-7">
            {reasons.map((r, i) => (
              <div key={r.title} className="flex items-start gap-6 py-6 border-b border-border-light group last:border-0">
                <div className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <span className="text-gold text-xs font-heading font-bold group-hover:text-ivory transition-colors duration-300">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-charcoal text-base mb-1">{r.title}</h3>
                  <p className="text-sm text-stone leading-relaxed font-light">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
