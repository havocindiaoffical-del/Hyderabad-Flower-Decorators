"use client";

import React from "react";
import { useSiteContent } from "@/components/providers/SiteContent";

export default function WhyChooseUs() {
  const { content } = useSiteContent();

  return (
    <section className="py-24 bg-ivory relative overflow-hidden" id="why-us">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left */}
          <div className="lg:col-span-5">
            <span className="label-uppercase text-gold mb-4 block">Why Us</span>
            <h2 className="heading-section text-charcoal">
              {content.why_choose_title || "Why Choose Us"}
            </h2>
            <p className="mt-8 text-stone font-light leading-relaxed max-w-md">
              We don&apos;t just decorate events — we create experiences. With meticulous attention to detail and a team that cares, we ensure every celebration is picture-perfect.
            </p>
            {content.testimonials && content.testimonials.length > 0 && (
              <div className="mt-12 p-8 bg-cream rounded-2xl border border-border-light">
                <p className="font-serif text-xl text-charcoal leading-relaxed italic">
                  &ldquo;{content.testimonials[0].quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold text-xs font-serif">{content.testimonials[0].name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal font-heading font-medium">{content.testimonials[0].name}</p>
                    <p className="text-xs text-stone font-body">{content.testimonials[0].event_type}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="lg:col-span-6 lg:col-start-7">
            {content.why_choose_items.map((item, i) => (
              <div key={i} className="flex items-start gap-6 py-6 border-b border-border-light group last:border-0">
                <div className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <span className="text-gold text-xs font-heading font-bold group-hover:text-ivory transition-colors duration-300">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-charcoal text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-stone leading-relaxed font-light">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
