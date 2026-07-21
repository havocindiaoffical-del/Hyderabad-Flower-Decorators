# Hyderabad Flower Decorators — Deployment Guide

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 + custom editorial design system
- **Animations**: Framer Motion + Lenis smooth scroll
- **UI**: Radix UI primitives + custom components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Email**: Resend
- **Deployment**: Netlify

## Design System
- **Colors**: Ivory `#FAF8F5`, Charcoal `#1A1A1A`, Muted Gold `#B8935F`
- **Supporting**: Cream `#F0EBE3`, Sage `#5B7553`, Stone `#6B6560`, Border `#E8E2DA`
- **Typography**: Playfair Display (hero), DM Sans (nav/labels), Inter (body)
- **Custom Cursor**: Gold ring + dot on desktop, hidden on touch devices

## Firebase Configuration
Already configured in `lib/firebase.ts` with your project credentials:
- **Project ID**: `hyderabad-flower-decorators`
- **Auth Domain**: `hyderabad-flower-decorators.firebaseapp.com`
- **Storage Bucket**: `hyderabad-flower-decorators.firebasestorage.app`

See `FIREBASE_SETUP.md` for full setup instructions.

## Environment Variables
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
BUSINESS_EMAIL=info@hydflowerdecorators.com
NEXT_PUBLIC_SITE_URL=https://hydflowerdecorators.com
```

## Pages (18 routes)
| Route | Description |
|-------|-------------|
| `/` | Home — Hero, Stats, Services, Gallery, WhyUs, Testimonials, CTA, FAQ |
| `/services` | Service detail pages with alternating editorial layouts |
| `/gallery` | Masonry gallery with category filter + lightbox |
| `/about` | Story, values, milestones |
| `/contact` | Contact grid |
| `/book` | Booking form with 12+ fields, validation, image upload |
| `/admin/login` | Firebase Auth login |
| `/admin/dashboard` | Stats cards, recent bookings table |
| `/admin/bookings` | Search/filter, booking detail, status management |
| `/admin/calendar` | Monthly calendar, block/unblock dates |
| `/admin/gallery` | Upload/feature/delete gallery images |
| `/admin/settings` | Business settings form |

## Build & Deploy
```bash
npm install
npx next build    # Production build
npm run dev       # Development server
```

## Netlify Deployment
1. Connect repo to Netlify
2. Set build command: `npx next build`
3. Set publish directory: `.next`
4. Add `@netlify/plugin-nextjs` plugin
5. Set environment variables (`RESEND_API_KEY`, `BUSINESS_EMAIL`)

## Features
- Firebase Authentication (admin login)
- Firestore database (bookings, gallery, calendar, settings)
- Firebase Storage (image uploads)
- Cinematic parallax hero with floating particles
- Lenis smooth scroll
- Custom cursor (desktop)
- Real Unsplash photography
- Horizontal scroll gallery
- Animated stat counters
- Booking form with 12+ fields + image upload
- Email notifications via Resend
- Booking management (accept/reject/complete/cancel)
- Calendar with block/unblock dates
- Gallery management with featured images
- Business settings
- SEO: metadata, OpenGraph, JSON-LD, sitemap.xml, robots.txt
- Responsive: floating WhatsApp/Call/Book on mobile
