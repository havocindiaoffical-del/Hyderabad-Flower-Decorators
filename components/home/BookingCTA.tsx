"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BookingCTA() {
  return (
    <section className="py-32 bg-ivory relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      </div>
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="label-uppercase text-gold mb-6 block">Ready?</span>
          <h2 className="heading-hero text-charcoal">
            Let's create<br />something <em className="font-serif text-gold not-italic">beautiful</em>
          </h2>
          <p className="mt-8 text-stone font-light text-lg max-w-lg mx-auto leading-relaxed">
            Book your appointment and let our expert team design the perfect floral decorations for your special occasion.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="group inline-flex items-center gap-3 bg-charcoal text-ivory px-10 py-5 rounded-full label-uppercase hover:bg-graphite transition-colors duration-300">
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a href="tel:+919876543210" className="inline-flex items-center gap-3 border border-border-light text-charcoal px-10 py-5 rounded-full label-uppercase hover:border-stone transition-colors duration-300">
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
