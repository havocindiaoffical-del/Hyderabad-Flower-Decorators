"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#0C0A09]">
      {/* Rich warm gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1410] via-[#0C0A09] to-[#0A0908]" />
        {/* Main gold glow — single, prominent */}
        <div className="absolute top-[20%] left-[20%] w-[60vw] h-[60vh] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(184,147,95,0.12) 0%, rgba(184,147,95,0.03) 40%, transparent 70%)" }} />
        {/* Bottom warm glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh]" style={{ background: "linear-gradient(to top, rgba(184,147,95,0.06) 0%, transparent 100%)" }} />
      </div>

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 opacity-0 animate-[fadeUp_0.8s_0.2s_forwards]">
          <div className="w-10 h-px bg-gold" />
          <span className="label-uppercase text-gold">Est. 2018 — Hyderabad</span>
        </div>

        {/* Headline */}
        <h1 className="heading-hero text-ivory max-w-4xl opacity-0 animate-[fadeUp_1s_0.4s_forwards]">
          Where Flowers<br />
          Meet <em className="text-gold not-italic font-serif">Artistry</em>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-ivory/40 max-w-lg font-body font-light leading-relaxed opacity-0 animate-[fadeUp_0.8s_0.6s_forwards]">
          Bespoke floral design for weddings, housewarming & every celebration that deserves to be unforgettable.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-[fadeUp_0.8s_0.8s_forwards]">
          <Link
            href="/book"
            className="group inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 rounded-full label-uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 border border-ivory/15 text-ivory/60 px-8 py-4 rounded-full label-uppercase hover:border-ivory/30 hover:text-ivory/80 transition-all duration-300"
          >
            View Gallery
          </Link>
        </div>

        {/* Trust markers */}
        <div className="mt-16 flex items-center gap-8 text-ivory/20 label-uppercase opacity-0 animate-[fadeUp_0.8s_1s_forwards]">
          <span>174+ Events</span>
          <span className="w-1 h-1 bg-gold/50 rounded-full" />
          <span>4.9 Rating</span>
          <span className="w-1 h-1 bg-gold/50 rounded-full" />
          <span>24/7 Service</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-[fadeUp_0.6s_1.5s_forwards]">
        <div className="w-5 h-8 rounded-full border border-ivory/10 flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 rounded-full bg-gold/50 animate-bounce" />
        </div>
      </div>

      {/* Side decorative line */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent hidden lg:block" />
    </section>
  );
}
