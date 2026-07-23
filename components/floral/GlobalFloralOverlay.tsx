"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FloatingPetals, ScrollFlowers } from "@/components/floral/FloralAnimations";

export default function GlobalFloralOverlay() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Delay floral overlay rendering until after initial page paint
  // to prevent mobile browser crashes from heavy animation on first render
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // No floral elements on admin pages or before client is ready
  if (pathname.startsWith("/admin") || !ready) return null;

  return (
    <>
      <FloatingPetals count={4} />
      <ScrollFlowers />
    </>
  );
}
