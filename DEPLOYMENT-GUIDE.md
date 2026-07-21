# Deployment Guide — Selling to Each Client

## How Neon Free Tier Works Per Client

Each client gets their **own Neon project** (free tier). That means:
- ✅ Separate database (no data mixing)
- ✅ 0.5 GB storage each (plenty for bookings)
- ✅ 191.9 compute hours/month each
- ✅ Auto-scaling serverless connections
- ✅ No cost for you

## Setup Steps for Each New Client

### 1. Create Neon Project
- Go to https://console.neon.tech
- Click "New Project"
- Name it: `client-name-hfd`
- Region: Choose closest to client (e.g., `ap-south-1` for India)
- Copy the connection string

### 2. Push Database Schema
```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require" npx drizzle-kit push
```
This creates all 4 tables automatically.

### 3. Create Firebase Project (for Auth + Storage)
- Go to https://console.firebase.google.com
- Create new project
- Enable Auth (Email/Password + Google)
- Enable Storage (start in test mode)
- Create admin user
- Copy the Firebase config

### 4. Update Firebase Config in Code
Edit `lib/firebase.ts` with the new client's Firebase credentials.

### 5. Deploy to Netlify
- Create new Netlify site
- Connect to GitHub repo (or fork it)
- Set environment variables:
  - `DATABASE_URL` = Neon connection string
  - `RESEND_API_KEY` = for email notifications (optional)
- Deploy!

### 6. First Admin Login
- Go to `/admin/login`
- Sign in with the Firebase admin user
- Done!

---

## Cost Breakdown (Per Client)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Neon Database** | 0.5 GB storage, 191.9 hrs | More than enough |
| **Firebase Auth** | Unlimited | Google + Email login |
| **Firebase Storage** | 5 GB free | For booking/gallery images |
| **Netlify Hosting** | 100 GB bandwidth, 300 min build | Sufficient |
| **Domain** | ~₹800/year | Client buys their own |

**Total cost: ₹0/month** (everything on free tiers!)

If you charge ₹15,000-₹50,000 per website, that's 100% profit.

---

## Pricing Suggestion

| Package | Price | What Client Gets |
|---------|-------|-----------------|
| **Basic** | ₹15,000 | Website + Booking System + 1 month support |
| **Standard** | ₹25,000 | Basic + Custom branding + 3 months support |
| **Premium** | ₹40,000 | Standard + SEO setup + WhatsApp integration + 6 months support |
| **Monthly Hosting** | ₹500-1,000/mo | You handle hosting, updates, backups |

---

## Scaling Up (When a Client Outgrows Free Tier)

Neon Pro plan: $19/month → 10 GB storage, always-on compute
Only needed if a client gets 1000+ bookings/month or heavy image uploads.
