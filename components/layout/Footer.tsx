"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top — Editorial */}
        <div className="py-20 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory leading-snug">
                Let's create something<br />
                <em className="text-gold">beautiful</em> together
              </h2>
              <Link href="/book" className="inline-block mt-8 label-uppercase bg-gold text-charcoal px-8 py-3.5 rounded-full hover:bg-gold-light transition-colors">
                Book Appointment
              </Link>
            </div>
            <div className="lg:col-span-3 lg:col-start-7">
              <span className="label-uppercase text-gold mb-6 block">Services</span>
              <ul className="space-y-3">
                {["Wedding", "Housewarming", "Baby Shower", "Pooja", "Corporate", "Custom"].map((s) => (
                  <li key={s}><Link href="/services" className="text-sm text-ivory/60 hover:text-ivory font-body transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-3">
              <span className="label-uppercase text-gold mb-6 block">Contact</span>
              <ul className="space-y-4">
                <li><a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory font-body transition-colors"><Phone className="w-4 h-4 text-gold" />+91 98765 43210</a></li>
                <li><a href="mailto:info@hydflowerdecorators.com" className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory font-body transition-colors"><Mail className="w-4 h-4 text-gold" />info@hydflowerdecorators.com</a></li>
                <li><div className="flex items-start gap-3 text-sm text-ivory/60 font-body"><MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />Hyderabad, Telangana</div></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center"><span className="text-gold text-[9px] font-serif">H</span></div>
            <span className="text-ivory/30 text-xs font-body">&copy; {new Date().getFullYear()} Hyderabad Flower Decorators</span>
          </div>
          <div className="flex items-center gap-6 text-ivory/30 text-xs font-body">
            <Link href="/about" className="hover:text-ivory/60 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-ivory/60 transition-colors">Contact</Link>
            <Link href="/book" className="hover:text-ivory/60 transition-colors">Book</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
