"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Award, Users, Clock, ArrowUpRight } from "lucide-react";

const values = [
  { icon: Heart, title: "Passion", desc: "Every arrangement crafted with love, treating each event as our own." },
  { icon: Award, title: "Quality", desc: "Only the freshest flowers and premium materials. No compromises." },
  { icon: Users, title: "Client Focus", desc: "Your vision is our blueprint. We listen, then deliver beyond expectations." },
  { icon: Clock, title: "Reliability", desc: "On-time delivery, every time. We respect your schedule." },
];

const milestones = [
  { year: "2018", event: "Founded in Hyderabad" },
  { year: "2019", event: "100+ Happy Customers" },
  { year: "2020", event: "Expanded to Corporate" },
  { year: "2022", event: "4.9★ Google Rating" },
  { year: "2024", event: "500+ Events" },
];

export default function AboutPageContent() {
  return (
    <div className="pt-24 bg-ivory">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Our Story</span>
            <h1 className="heading-hero text-charcoal">Where passion meets <em className="font-serif text-gold not-italic">creativity</em></h1>
            <p className="mt-8 text-stone font-light text-lg max-w-2xl leading-relaxed">
              Born from a simple belief — that every celebration deserves to be beautiful. What started as a small team with big dreams has grown into Hyderabad&apos;s most trusted decoration service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="heading-section text-charcoal mb-8">Our Journey</h2>
              <div className="space-y-6 text-stone font-light leading-relaxed">
                <p>In 2018, we set out with a single mission: to make premium flower decorations accessible and affordable for every celebration in Hyderabad.</p>
                <p>By sourcing directly from flower farms, investing in skilled artisans, and streamlining our processes, we created a service that delivers premium quality at honest prices.</p>
                <p>Today, with over 500 successful events and a 4.9-star rating, we continue to push creative boundaries while staying true to our roots — fresh flowers, fair prices, and heartfelt service.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80"
                  alt="Hyderabad Flower Decorators"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-serif text-3xl text-ivory">HFD</p>
                  <p className="text-ivory/60 text-sm font-body mt-1">Since 2018</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="label-uppercase text-gold mb-4 block">Values</span>
            <h2 className="heading-section text-charcoal">What drives <em className="font-serif text-gold">us</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-light rounded-2xl overflow-hidden">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-ivory p-10"
                >
                  <Icon className="w-5 h-5 text-gold mb-6" />
                  <h3 className="font-heading font-semibold text-charcoal text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-stone font-light leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-cream">
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="label-uppercase text-gold mb-4 block">Timeline</span>
            <h2 className="heading-section text-charcoal">Milestones</h2>
          </div>
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-8 py-6 border-b border-border-light last:border-0"
            >
              <span className="font-serif text-xl text-gold w-14 shrink-0">{m.year}</span>
              <span className="text-charcoal text-sm font-body pt-1">{m.event}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-charcoal text-center">
        <h2 className="heading-section text-ivory mb-4">Ready to celebrate?</h2>
        <p className="text-ivory/40 font-light mb-8">Let us be part of your next special occasion.</p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 rounded-full label-uppercase hover:bg-gold-light transition-colors text-xs"
        >
          Book Appointment <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
