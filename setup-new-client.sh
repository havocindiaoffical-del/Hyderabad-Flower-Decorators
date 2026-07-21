#!/bin/bash
# ─── Setup Script for New Client ──────────────────────────────
# Usage: ./setup-new-client.sh
# This creates the database tables in whatever DATABASE_URL is set.
#
# Steps for each new client:
# 1. Create a new Neon project at https://console.neon.tech
# 2. Copy the connection string
# 3. Run: DATABASE_URL="postgresql://..." npm run db:push
# 4. Add DATABASE_URL to Netlify environment variables
# 5. Deploy!
