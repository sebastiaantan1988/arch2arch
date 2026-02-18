# ARCH2ARCH — Personal Ultra-Triathlon Dashboard

Live dashboard tracking Sebastiaan Tan's journey to the Arch2Arch ultra-triathlon (London → English Channel → Paris).

## Quick Deploy

### Step 1: Set up Supabase Database
1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and run it
3. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Push to GitHub
```bash
cd arch2arch
git init
git add .
git commit -m "Initial Arch2Arch dashboard"
git remote add origin https://github.com/YOUR_USERNAME/arch2arch.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `arch2arch` GitHub repo
3. Add environment variables (from `.env.example`):
   - `OURA_CLIENT_ID`
   - `OURA_CLIENT_SECRET`
   - `OURA_REDIRECT_URI` → `https://yourdomain.com/api/oura/callback`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://yourdomain.com`
   - `PRIVATE_PASSWORD` → choose a password
   - `HEALTH_EXPORT_API_KEY` → generate a random string
4. Click **Deploy**

### Step 4: Connect your domain (GoDaddy)
1. In Vercel → **Settings → Domains** → add your domain
2. In GoDaddy → **DNS Management**:
   - Add CNAME record: `@` → `cname.vercel-dns.com`
   - Or: A record → `76.76.21.21`
3. Wait ~5 minutes for DNS propagation

### Step 5: Connect Oura Ring
1. Update Oura developer app redirect URI to: `https://yourdomain.com/api/oura/callback`
2. Visit `https://yourdomain.com/api/oura` in your browser
3. Log in to Oura and authorize
4. You'll be redirected back to your dashboard

### Step 6: Set up Health Auto Export (Apple Watch)
1. Open Health Auto Export on iPhone
2. Go to **Automations → New Automation → REST API**
3. URL: `https://yourdomain.com/api/health-export`
4. Add header: `x-api-key` → your `HEALTH_EXPORT_API_KEY`
5. Select metrics: Resting HR, HRV, VO2max, Steps, Active Energy, Body Mass
6. Select workouts: All
7. Format: JSON
8. Frequency: Every 6 hours

### Step 7: Set up daily Oura sync (optional)
Use Vercel Cron Jobs (add to `vercel.json`):
```json
{
  "crons": [{
    "path": "/api/oura/sync?days=2",
    "schedule": "0 6 * * *"
  }]
}
```
This syncs Oura data every day at 6 AM UTC.

## Project Structure
```
arch2arch/
├── app/
│   ├── layout.js          # Root layout + metadata
│   ├── globals.css         # Global styles
│   ├── page.js             # Home / Hero page
│   ├── dashboard/page.js   # Live dashboard
│   ├── training/page.js    # Weekly training log
│   ├── journey/page.js     # Blog + timeline
│   ├── challenge/page.js   # What is A2A
│   ├── team/page.js        # Crew recruitment
│   └── api/
│       ├── oura/
│       │   ├── route.js         # Start OAuth flow
│       │   ├── callback/route.js # OAuth callback
│       │   └── sync/route.js    # Pull Oura data
│       ├── health-export/route.js # Apple Watch webhook
│       └── guestbook/route.js    # Guestbook API
├── components/
│   └── ui.js               # Shared components
├── lib/
│   ├── supabase.js         # Supabase client
│   └── data.js             # Data fetching + mock data
├── supabase-schema.sql     # Database schema
├── .env.example            # Environment variables template
├── package.json
└── next.config.js
```

## Data Flow
```
Oura Ring ──→ Oura API ──→ /api/oura/sync ──→ Supabase ──→ Dashboard
Apple Watch ──→ Health Auto Export ──→ /api/health-export ──→ Supabase ──→ Dashboard
Manual ──→ Supabase (direct or CSV upload) ──→ Dashboard
```

## Tech Stack
- **Frontend:** Next.js 14 (React)
- **Hosting:** Vercel (free)
- **Database:** Supabase (free)
- **APIs:** Oura Ring v2, Health Auto Export
- **Domain:** GoDaddy → Vercel DNS
