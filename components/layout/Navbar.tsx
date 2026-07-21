"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  if (isAdmin) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-ivory/90 backdrop-blur-xl shadow-[0_1px_0_0_#E8E2DA] py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
              <span className="text-gold group-hover:text-ivory text-[10px] font-serif font-semibold transition-colors duration-500">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="label-uppercase text-charcoal">Hyderabad</span>
              <span className="block label-uppercase text-stone mt-0.5" style={{ fontSize: "0.55rem", letterSpacing: "0.35em" }}>Flower Decorators</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn(
                  "label-uppercase transition-colors duration-300 relative",
                  pathname === l.href ? "text-gold" : "text-stone hover:text-charcoal"
                )}>
                {l.label}
                {pathname === l.href && <motion.div layoutId="nav" className="absolute -bottom-1 left-0 right-0 h-px bg-gold" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/book" className="label-uppercase bg-charcoal text-ivory px-7 py-3 rounded-full hover:bg-graphite transition-colors duration-300">
              Book
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-charcoal" aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ivory md:hidden flex items-center justify-center">
            <nav className="flex flex-col items-center gap-8">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 + 0.1 }}>
                  <Link href={l.href} className={cn("font-serif text-3xl", pathname === l.href ? "text-gold" : "text-charcoal")}>{l.label}</Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <Link href="/book" className="label-uppercase bg-charcoal text-ivory px-8 py-3.5 rounded-full">Book Appointment</Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
