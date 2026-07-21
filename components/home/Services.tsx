"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const services = [
  { id: "housewarming", title: "Housewarming", desc: "Vibrant floral arrangements, traditional torans & elegant entrance decorations for your Griha Pravesh.", img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80" },
  { id: "wedding", title: "Wedding", desc: "Stunning mandap decorations, floral arches & elaborate stage designs for your magical day.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" },
  { id: "baby-shower", title: "Baby Shower", desc: "Adorable themed decorations, balloon arrangements & photo booths for the little one's welcome.", img: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80" },
  { id: "pooja", title: "Pooja", desc: "Sacred and serene decorations for all religious ceremonies with devotion and tradition.", img: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80" },
  { id: "corporate", title: "Corporate", desc: "Professional floral decor for office inaugurations, annual events & brand activations.", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80" },
  { id: "custom", title: "Custom", desc: "Got a unique vision? We bring your dream decorations to life with personalized themes.", img: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80" },
];

export default function Services() {
  return (
    <section className="py-24 bg-ivory" id="services">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <span className="label-uppercase text-gold mb-4 block">What We Do</span>
            <h2 className="heading-section text-charcoal">
              Crafting beauty for<br />
              <em className="font-serif text-gold">every occasion</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-end">
            <p className="text-stone font-light leading-relaxed">
              From intimate ceremonies to grand celebrations, a complete range of decoration services tailored to your vision and budget.
            </p>
          </div>
        </div>

        {/* Services — alternating layout */}
        <div className="space-y-0">
          {services.map((s, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={s.id} id={s.id} className="group">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-12 lg:py-16 border-b border-border-light ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`lg:col-span-6 ${!isEven ? "lg:col-start-7 lg:row-start-1" : ""}`}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group-hover:shadow-xl transition-shadow duration-500">
                      <Image src={s.img} alt={s.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                    </div>
                  </div>
                  <div className={`lg:col-span-5 flex flex-col justify-center ${!isEven ? "" : "lg:col-start-1"}`}>
                    <span className="text-gold label-uppercase mb-3">0{i + 1}</span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3 italic">{s.title}</h3>
                    <p className="text-stone font-light leading-relaxed mb-6 max-w-md">{s.desc}</p>
                    <Link href={`/book?event_type=${s.id}`} className="group/link inline-flex items-center gap-2 label-uppercase text-charcoal hover:text-gold transition-colors duration-300">
                      Enquire <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
