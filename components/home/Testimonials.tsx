"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { id: 1, name: "Lakshmi Reddy", review: "Absolutely stunning decorations for our housewarming! Professional team, arrived on time, and the floral arrangements exceeded our expectations.", event: "Housewarming", initials: "LR" },
  { id: 2, name: "Rajesh & Swathi", review: "Our wedding decoration was like a dream come true. The mandap was breathtaking and every guest was amazed.", event: "Wedding", initials: "RS" },
  { id: 3, name: "Anitha Sharma", review: "The baby shower decorations were perfect! They matched our theme exactly and the balloon arrangements were adorable.", event: "Baby Shower", initials: "AS" },
  { id: 4, name: "Venkat Prasad", review: "Amazing job on our corporate Diwali event. The office looked festive yet professional. Very cooperative team.", event: "Corporate", initials: "VP" },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);
  const paginate = useCallback((d: number) => { setDir(d); setIdx((p) => (p + d + testimonials.length) % testimonials.length); }, []);

  useEffect(() => { const t = setInterval(() => paginate(1), 7000); return () => clearInterval(t); }, [paginate]);

  const c = testimonials[idx];

  return (
    <section className="py-32 bg-charcoal relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <span className="label-uppercase text-gold mb-4 block">Testimonials</span>
          <h2 className="heading-section text-ivory">What our <em className="font-serif text-gold">clients</em> say</h2>
        </motion.div>

        <div className="relative min-h-[200px]">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div key={idx} custom={dir}
              initial={{ opacity: 0, y: dir > 0 ? 30 : -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir > 0 ? -30 : 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <blockquote className="font-serif text-2xl sm:text-3xl text-ivory leading-relaxed italic mb-10">
                "{c.review}"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-xs font-serif">{c.initials}</span>
                </div>
                <div className="text-left">
                  <p className="text-ivory text-sm font-heading font-medium">{c.name}</p>
                  <p className="text-ivory/40 text-xs font-body">{c.event}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-14">
          <button onClick={() => paginate(-1)} className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/40 hover:text-ivory hover:border-ivory/30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                className={`rounded-full transition-all duration-500 ${i === idx ? "w-8 h-1 bg-gold" : "w-1 h-1 bg-ivory/20"}`} />
            ))}
          </div>
          <button onClick={() => paginate(1)} className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/40 hover:text-ivory hover:border-ivory/30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </section>
  );
}
