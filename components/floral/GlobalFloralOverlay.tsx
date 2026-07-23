"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FloatingPetals, ScrollFlowers } from "@/components/floral/FloralAnimations";

export default function GlobalFloralOverlay() {
  const pathname = usePathname();

  // No floral elements on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <FloatingPetals count={4} />
      <ScrollFlowers />
    </>
  );
}
