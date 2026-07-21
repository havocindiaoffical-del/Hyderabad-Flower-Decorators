"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Wedding", "Housewarming", "Baby Shower", "Pooja", "Corporate"];
const images = [
  { id: 1, title: "Grand Wedding Mandap", cat: "Wedding", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", h: "h-80" },
  { id: 2, title: "Traditional Housewarming", cat: "Housewarming", src: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80", h: "h-64" },
  { id: 3, title: "Baby Shower Bliss", cat: "Baby Shower", src: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80", h: "h-72" },
  { id: 4, title: "Pooja Decoration", cat: "Pooja", src: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80", h: "h-80" },
  { id: 5, title: "Corporate Event", cat: "Corporate", src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", h: "h-64" },
  { id: 6, title: "Wedding Entrance", cat: "Wedding", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", h: "h-72" },
  { id: 7, title: "Floral Arch", cat: "Wedding", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", h: "h-80" },
  { id: 8, title: "Griha Pravesh", cat: "Housewarming", src: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", h: "h-64" },
  { id: 9, title: "Birthday Theme", cat: "All", src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", h: "h-72" },
  { id: 10, title: "Ganesh Chaturthi", cat: "Pooja", src: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80", h: "h-80" },
  { id: 11, title: "Reception Stage", cat: "Wedding", src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80", h: "h-64" },
  { id: 12, title: "Office Inauguration", cat: "Corporate", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", h: "h-72" },
];

export default function GalleryPageContent() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const filtered = active === "All" ? images : images.filter((i) => i.cat === active);

  return (
    <div className="pt-24 bg-ivory">
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Portfolio</span>
            <h1 className="heading-hero text-charcoal">Our <em className="font-serif text-gold not-italic">gallery</em></h1>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex gap-1 mb-12 flex-wrap">
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
          </div>
          <div className="masonry">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group cursor-pointer rounded-2xl overflow-hidden"
                  onClick={() => setLightbox(i)}
                >
                  <div className={`${img.h} w-full relative overflow-hidden bg-cream`}>
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-ivory text-sm font-body font-medium">{img.title}</p>
                      <p className="text-ivory/40 text-xs font-body">{img.cat}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

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
                <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden">
                  <Image
                    src={filtered[lightbox].src}
                    alt={filtered[lightbox].title}
                    fill
                    className="object-cover"
                    sizes="80vw"
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
    </div>
  );
}
