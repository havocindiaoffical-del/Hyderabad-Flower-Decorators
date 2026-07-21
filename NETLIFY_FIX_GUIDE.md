# 🛠️ Netlify Deployment Fix Guide

Your site code is **perfect** — the problem is only in Netlify's dashboard settings.
You need to fix **2 things** in the Netlify UI. Here's exactly how:

---

## Fix 1: Change Publish Directory

The publish directory is currently set to your repo root (which Netlify rejects for Next.js).
It needs to be `.next` instead.

### Steps:

1. Go to **https://app.netlify.com**
2. Click on your site **"Hyderabad Flower Decorators"**
3. In the top navigation bar, click **"Site configuration"**
4. In the left sidebar, click **"Build & deploy"**
5. Click the **"Build settings"** tab (if not already selected)
6. Find the row that says **"Publish directory"** — it currently shows `/opt/build/repo` or is empty
7. Click **"Edit settings"** button (top right of the Build settings section)
8. In the **Publish directory** field, type: **`.next`**
9. Click **"Save"**

> ⚠️ **Important**: The publish directory must be exactly `.next` (with the dot at the start).
> This tells Netlify where Next.js puts its build output.

---

## Fix 2: Upgrade the Next.js Plugin (v4 → v5)

Your Netlify UI installed an old v4 plugin which is **incompatible** with Next.js 16.
Your package.json already has v5 — the UI plugin is overriding it.

### Option A: Remove the UI-installed plugin (recommended)

1. Go to **https://app.netlify.com**
2. Click on your site **"Hyderabad Flower Decorators"**
3. Click **"Integrations"** in the top navigation
4. Find **"Next.js"** in the list of installed integrations/plugins
5. Click on it, then click **"Uninstall"** or **"Remove"**
6. Confirm the removal

After removing it, the v5.15.12 from your `package.json` will take over automatically.

### Option B: Upgrade the plugin to v5

1. Go to **https://app.netlify.com/plugins**
2. Find **"@netlify/plugin-nextjs"**
3. Check if there's an **"Update"** button — if so, update to v5
4. If no update option, go with **Option A** above

---

## Fix 3: Add Resend API Key (for email notifications)

1. Go to your site → **Site configuration** → **Environment variables**
2. Click **"Add a variable"**
3. Key: `RESEND_API_KEY`
4. Value: Your Resend API key (starts with `re_...`)
5. Click **"Save"**

> If you don't have a Resend API key yet, you can skip this for now.
> The booking form will still work — it just won't send email notifications.

---

## Final Step: Clean Deploy

After making the changes above:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for the build to complete

---

## ✅ What Success Looks Like

The build log should show:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
```

And the final line should say: **"Deploy is live!"** 🎉

---

## 🆘 If It Still Fails

Copy the **full build log** (from "Building..." to the error) and share it with me.
I can fix whatever is wrong from the code side.

Common issues:
- If you see `npm ERR!` → run `npm install` locally and commit `package-lock.json`
- If you see TypeScript errors → share the log and I'll fix them
- If you see "publish directory" error again → the UI setting didn't save (try again)
