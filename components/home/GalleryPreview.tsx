"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

const images = [
  { id: 1, title: "Grand Wedding Mandap", cat: "Wedding", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", aspect: "aspect-[3/4]" },
  { id: 2, title: "Traditional Housewarming", cat: "Housewarming", src: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80", aspect: "aspect-square" },
  { id: 3, title: "Baby Shower Bliss", cat: "Baby Shower", src: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80", aspect: "aspect-[4/5]" },
  { id: 4, title: "Pooja Decoration", cat: "Pooja", src: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80", aspect: "aspect-[3/4]" },
  { id: 5, title: "Corporate Event", cat: "Corporate", src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", aspect: "aspect-square" },
  { id: 6, title: "Wedding Entrance", cat: "Wedding", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", aspect: "aspect-[4/5]" },
  { id: 7, title: "Floral Arch", cat: "Wedding", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", aspect: "aspect-[3/4]" },
  { id: 8, title: "Griha Pravesh", cat: "Housewarming", src: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", aspect: "aspect-square" },
];

const categories = ["All", "Wedding", "Housewarming", "Baby Shower", "Pooja", "Corporate"];

export default function GalleryPreview() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const filtered = active === "All" ? images : images.filter((i) => i.cat === active);

  return (
    <section className="py-32 bg-cream" id="gallery">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="label-uppercase text-gold mb-4 block">Portfolio</span>
            <h2 className="heading-section text-charcoal">Our <em className="font-serif text-gold">creations</em></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-1 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full label-uppercase transition-all duration-300 ${
                  active === c ? "bg-charcoal text-ivory" : "text-stone hover:text-charcoal"
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Horizontal scroll gallery */}
        <div className="horizontal-scroll pb-4 -mx-6 px-6 lg:-mx-12 lg:px-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group cursor-pointer relative"
                onClick={() => setLightbox(i)}
              >
                <div className={`${img.aspect} w-[280px] sm:w-[350px] rounded-2xl relative overflow-hidden bg-cream`}>
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500 rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl">
                    <p className="text-ivory text-sm font-body font-medium">{img.title}</p>
                    <p className="text-ivory/50 text-xs font-body">{img.cat}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/gallery" className="group inline-flex items-center gap-2 label-uppercase text-charcoal hover:text-gold transition-colors">
            View Full Gallery <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-ivory/50 hover:text-ivory transition-colors">
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + filtered.length) % filtered.length); }}
              className="absolute left-6 text-ivory/50 hover:text-ivory transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % filtered.length); }}
              className="absolute right-6 text-ivory/50 hover:text-ivory transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightbox] && (
                <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden">
                  <Image
                    src={filtered[lightbox].src}
                    alt={filtered[lightbox].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 80vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-charcoal/80 to-transparent">
                    <p className="font-serif text-ivory text-2xl">{filtered[lightbox].title}</p>
                    <p className="text-ivory/50 text-sm font-body">{filtered[lightbox].cat}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
