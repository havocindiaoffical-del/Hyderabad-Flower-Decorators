import { DM_Sans, Playfair_Display, Inter } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", weight: ["300", "400", "500"] });
const dmSans = DM_Sans({ variable: "--font-manrope", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });

export const metadata = {
  metadataBase: new URL("https://hydflowerdecorators.com"),
  title: { default: "Hyderabad Flower Decorators — Luxury Floral Design", template: "%s — HFD" },
  description: "Hyderabad's finest flower decoration atelier. Bespoke floral design for weddings, housewarming & celebrations.",
  keywords: ["luxury flower decoration hyderabad", "wedding decorator", "floral design", "housewarming decoration", "baby shower decorations"],
  openGraph: { type: "website", locale: "en_IN", siteName: "HFD", title: "Hyderabad Flower Decorators", description: "Luxury floral design for every celebration." },
  robots: { index: true, follow: true },
};

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { UserAuthProvider } from "@/components/providers/UserAuth";
import { SiteContentProvider } from "@/components/providers/SiteContent";
import GlobalFloralOverlay from "@/components/floral/GlobalFloralOverlay";
import TextRevealObserver from "@/components/features/TextRevealObserver";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${playfair.variable} h-full antialiased`} >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Hyderabad Flower Decorators",
              description: "Luxury floral decoration service in Hyderabad for weddings, housewarming, baby showers & corporate events.",
              url: "https://hydflowerdecorators.com",
              telephone: "+919876543210",
              email: "info@hydflowerdecorators.com",
              address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
              priceRange: "₹₹",
              image: "https://hydflowerdecorators.com/og-image.jpg",
              sameAs: ["https://instagram.com/hydflowerdecorators", "https://facebook.com/hydflowerdecorators"],
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "174" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-body">
        <UserAuthProvider>
          <SiteContentProvider>
          <SmoothScroll>
            <CustomCursor />
            <Navbar />
            <main className="flex-1 relative">{children}</main>
            <Footer />
            <FloatingActions />
            <GlobalFloralOverlay />
            <TextRevealObserver />
          </SmoothScroll>
          </SiteContentProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}
