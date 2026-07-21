"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden bg-charcoal">
      {/* Cinematic background with parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3D2B1F] via-[#2A1F16] to-[#1A1A1A]" />
        {/* Warm floral glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-gold/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-rose-900/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[80px]" />
        {/* Subtle animated radial glow */}
        <motion.div
          animate={{ scale: [1, 1.05], opacity: [0.15, 0.25] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(184,147,95,0.08)_0%,_transparent_60%)]" />
        </motion.div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />

      {/* Content */}
      <motion.div style={{ opacity, y: textY }} className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-10 h-px bg-gold" />
          <span className="label-uppercase text-gold">Est. 2018 — Hyderabad</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="heading-hero text-ivory max-w-4xl"
        >
          Where Flowers<br />
          Meet <em className="text-gold not-italic font-serif">Artistry</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 text-lg sm:text-xl text-ivory/50 max-w-lg font-body font-light leading-relaxed"
        >
          Bespoke floral design for weddings, housewarming & every celebration that deserves to be unforgettable.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
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
        </motion.div>

        {/* Trust markers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16 flex items-center gap-8 text-ivory/30 label-uppercase"
        >
          <span>174+ Events</span>
          <span className="w-1 h-1 bg-gold rounded-full" />
          <span>4.9 Rating</span>
          <span className="w-1 h-1 bg-gold rounded-full" />
          <span>24/7 Service</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
        />
      </motion.div>

      {/* Side decorative line */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden lg:block" />
    </section>
  );
}
