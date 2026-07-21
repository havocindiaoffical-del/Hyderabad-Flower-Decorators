"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function FloatingActions() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
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

      {/* Mobile */}
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.5 }}
        className="fixed bottom-5 left-4 right-4 z-40 md:hidden flex gap-2">
        <a href="tel:+919876543210" className="flex-1 h-11 bg-charcoal text-ivory rounded-xl flex items-center justify-center gap-2 text-xs font-body label-uppercase"><Phone className="w-3.5 h-3.5" />Call</a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 h-11 bg-sage text-ivory rounded-xl flex items-center justify-center gap-2 text-xs font-body label-uppercase"><MessageCircle className="w-3.5 h-3.5" />Chat</a>
        <Link href="/book" className="flex-1 h-11 bg-gold text-charcoal rounded-xl flex items-center justify-center gap-2 text-xs font-body label-uppercase font-semibold"><Calendar className="w-3.5 h-3.5" />Book</Link>
      </motion.div>
    </div>
  );
}
