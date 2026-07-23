"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function FloatingActions() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);

  // Listen for mobile menu open/close events from Navbar
  useEffect(() => {
    const onMenuOpen = () => setMenuOpen(true);
    const onMenuClose = () => setMenuOpen(false);
    window.addEventListener("hfd-menu-open", onMenuOpen);
    window.addEventListener("hfd-menu-close", onMenuClose);
    return () => {
      window.removeEventListener("hfd-menu-open", onMenuOpen);
      window.removeEventListener("hfd-menu-close", onMenuClose);
    };
  }, []);

  // Hide mobile bar when scrolling down, show when scrolling up or stopped
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let hideTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          // Hide if scrolled down more than 100px from last visible position
          if (currentY > lastScrollY + 80 && currentY > 200) {
            setScrollHidden(true);
            lastScrollY = currentY;
          }
          // Show if scrolled up
          else if (currentY < lastScrollY - 40) {
            setScrollHidden(false);
            lastScrollY = currentY;
          }
          ticking = false;
        });
      }
    };

    // Auto-show after 3 seconds of hiding (so buttons don't stay hidden forever)
    const interval = setInterval(() => {
      if (scrollHidden) {
        hideTimer = setTimeout(() => setScrollHidden(false), 3000);
      }
    }, 3000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [scrollHidden]);

  // Show again when pathname changes (page navigation)
  useEffect(() => {
    setScrollHidden(false);
    setMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  // On mobile: hide when menu is open OR when user is scrolling down
  const mobileBarVisible = !menuOpen && !scrollHidden;

  return (
    <>
      {/* Desktop: floating circles (right side) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-3">
        <motion.a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 15 }}
          className="w-11 h-11 rounded-full bg-sage text-ivory flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="WhatsApp">
          <MessageCircle className="w-4 h-4" />
        </motion.a>
        <motion.a href="tel:+919876543210"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7, type: "spring", stiffness: 200, damping: 15 }}
          className="w-11 h-11 rounded-full bg-charcoal text-ivory flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Call">
          <Phone className="w-4 h-4" />
        </motion.a>
        <Link href="/book"
          className="w-11 h-11 rounded-full bg-gold text-charcoal flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Book">
          <Calendar className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile: bottom action bar — hidden when menu open or scrolling */}
      <AnimatePresence>
        {mobileBarVisible && (
          <motion.div
            key="mobile-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-5 left-4 right-4 z-40 flex md:hidden gap-2"
          >
            <a href="tel:+919876543210" className="flex-1 h-12 bg-charcoal text-ivory rounded-xl flex items-center justify-center gap-2 text-sm font-body label-uppercase shadow-lg"><Phone className="w-4 h-4" />Call</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 h-12 bg-sage text-ivory rounded-xl flex items-center justify-center gap-2 text-sm font-body label-uppercase shadow-lg"><MessageCircle className="w-4 h-4" />Chat</a>
            <Link href="/book" className="flex-1 h-12 bg-gold text-charcoal rounded-xl flex items-center justify-center gap-2 text-sm font-body label-uppercase font-semibold shadow-lg"><Calendar className="w-4 h-4" />Book</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
