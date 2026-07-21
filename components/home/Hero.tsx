"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-charcoal">
      {/* Clean warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A1F16] via-[#1A1A1A] to-[#0F0F0F]" />

      {/* Single subtle gold glow */}
      <div className="absolute top-1/3 left-1/4 w-[800px] h-[600px] bg-gold/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px]" />

      {/* Gradient overlay — clean vertical fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-4 mb-8 animate-[fadeUp_1s_0.3s_both]"
        >
          <div className="w-10 h-px bg-gold" />
          <span className="label-uppercase text-gold">Est. 2018 — Hyderabad</span>
        </div>

        {/* Headline */}
        <h1
          className="heading-hero text-ivory max-w-4xl animate-[fadeUp_1.2s_0.5s_both]"
        >
          Where Flowers<br />
          Meet <em className="text-gold not-italic font-serif">Artistry</em>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-8 text-lg sm:text-xl text-ivory/50 max-w-lg font-body font-light leading-relaxed animate-[fadeUp_1s_0.7s_both]"
        >
          Bespoke floral design for weddings, housewarming & every celebration that deserves to be unforgettable.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-wrap items-center gap-4 animate-[fadeUp_1s_0.9s_both]"
        >
          <Link
            href="/book"
            className="group inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 rounded-full label-uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 border border-ivory/20 text-ivory/70 px-8 py-4 rounded-full label-uppercase hover:border-ivory/40 hover:text-ivory transition-all duration-300"
          >
            View Gallery
          </Link>
        </div>

        {/* Trust markers */}
        <div
          className="mt-16 flex items-center gap-8 text-ivory/30 label-uppercase animate-[fadeUp_1s_1.2s_both]"
        >
          <span>174+ Events</span>
          <span className="w-1 h-1 bg-gold rounded-full" />
          <span>4.9 Rating</span>
          <span className="w-1 h-1 bg-gold rounded-full" />
          <span>24/7 Service</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-[fadeUp_1s_2s_both]">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold/40 to-transparent animate-bounce" style={{ animationDuration: '2s' }} />
      </div>

      {/* Side decorative line */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden lg:block" />
    </section>
  );
}
