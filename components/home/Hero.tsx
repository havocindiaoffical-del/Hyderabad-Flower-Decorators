"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HeroFloralAnimation } from "@/components/floral/FloralAnimations";
import { useSiteContent } from "@/components/providers/SiteContent";

export default function Hero() {
  const { content } = useSiteContent();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrollY * 0.06}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Split the hero title into parts for styling
  // The title format from content editor is like "Where passion meets creativity"
  // We want to show it with the last word/phrase highlighted in gold italic
  const heroTitle = content.hero.title;
  // Split at the last space or line break to create emphasis
  const titleParts = heroTitle.split("\n");
  const hasMultipleLines = titleParts.length > 1;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FAF8F5]">
      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm gradient wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[70vw] h-[80vh] opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(184,147,95,0.3) 0%, rgba(91,117,83,0.15) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[50vw] h-[50vh] opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(91,117,83,0.3) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* 3D Floral Animation Layer */}
      <HeroFloralAnimation />

      {/* Botanical line-art decoration — top left */}
      <svg
        className="absolute top-28 left-4 sm:left-12 w-20 h-32 opacity-[0.07] pointer-events-none"
        viewBox="0 0 80 130"
        fill="none"
        stroke="#5B7553"
        strokeWidth="0.8"
      >
        <path d="M40 0 C40 0 55 20 55 45 C55 65 40 75 40 75 C40 75 25 65 25 45 C25 20 40 0 40 0Z" />
        <path d="M40 75 C40 75 60 85 65 110 C68 125 55 130 55 130" />
        <path d="M40 75 C40 75 20 85 15 110 C12 125 25 130 25 130" />
        <path d="M55 45 C60 30 75 25 80 35" />
        <path d="M25 45 C20 30 5 25 0 35" />
      </svg>

      {/* Botanical line-art — bottom right of image area */}
      <svg
        className="absolute bottom-32 right-4 sm:right-16 w-16 h-24 opacity-[0.06] pointer-events-none hidden lg:block"
        viewBox="0 0 60 90"
        fill="none"
        stroke="#B8935F"
        strokeWidth="0.6"
      >
        <path d="M30 0 C30 0 45 15 45 35 C45 50 30 55 30 55 C30 55 15 50 15 35 C15 15 30 0 30 0Z" />
        <path d="M30 55 L30 90" />
        <path d="M30 70 L45 60" />
        <path d="M30 70 L15 60" />
      </svg>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT — Text content */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 opacity-0 animate-[fadeUp_0.8s_0.2s_forwards]">
                <div className="w-8 h-px bg-gold/60" />
                <span className="label-uppercase text-gold tracking-[0.3em]">
                  {content.hero.subtitle}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="opacity-0 animate-[fadeUp_1s_0.4s_forwards]"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                }}
              >
                {hasMultipleLines ? (
                  titleParts.map((part, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {i === titleParts.length - 1 ? (
                        <em className="not-italic" style={{ color: "#B8935F", fontStyle: "italic" }}>{part}</em>
                      ) : (
                        part
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    {heroTitle}
                  </>
                )}
              </h1>

              {/* Supporting text */}
              <p
                className="mt-7 max-w-md opacity-0 animate-[fadeUp_0.8s_0.6s_forwards]"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "#6B6560",
                }}
              >
                {content.hero.description}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-[fadeUp_0.8s_0.8s_forwards]">
                <Link
                  href="/book"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-manrope), system-ui, sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    background: "#B8935F",
                    color: "#1A1A1A",
                  }}
                >
                  {content.cta_button_text || "Book Your Event"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:border-charcoal/40 hover:text-charcoal"
                  style={{
                    fontFamily: "var(--font-manrope), system-ui, sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    border: "1px solid #E8E2DA",
                    color: "#6B6560",
                  }}
                >
                  Explore Our Work
                </Link>
              </div>
            </div>

            {/* CENTER — Spacer on desktop */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* RIGHT — Floral image composition */}
            <div className="lg:col-span-6 xl:col-span-6 relative opacity-0 animate-[fadeUp_1.2s_0.5s_forwards]">
              <div ref={imageRef} className="relative will-change-transform">
                {/* Main floral image */}
                <div
                  className="relative overflow-hidden mx-auto lg:mx-0"
                  style={{
                    borderRadius: "180px 40px 160px 50px",
                    maxWidth: "560px",
                    aspectRatio: "4/5",
                  }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1561128290-005859246e58?q=80&w=1200&auto=format&fit=crop"
                    alt="Luxury floral arrangement with roses and hydrangeas for premium wedding decoration"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 90vw, 45vw"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 80px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>

                {/* Small overlapping accent image */}
                <div
                  className="absolute -bottom-8 -left-6 sm:-bottom-10 sm:-left-10 w-32 h-32 sm:w-40 sm:h-40 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)]"
                  style={{ borderRadius: "60px 20px 50px 20px" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=400&auto=format&fit=crop"
                    alt="Close-up of delicate pink wedding flowers"
                    fill
                    className="object-cover"
                    sizes="160px"
                    priority
                  />
                </div>

                {/* Decorative rings */}
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-gold/15 pointer-events-none hidden lg:block" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border border-sage/10 pointer-events-none hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_0.6s_1.6s_forwards]">
        <span
          style={{
            fontFamily: "var(--font-manrope), system-ui, sans-serif",
            fontSize: "0.55rem",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#9B9490",
          }}
        >
          Scroll to Explore
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gold/50 animate-bounce" style={{ animationDuration: '2s' }} />
      </div>

      {/* Subtle vertical gold line */}
      <div className="absolute right-24 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden xl:block" />
    </section>
  );
}
