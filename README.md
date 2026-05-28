# ⚖️ LandlordShield

> Never get blindsided by a new landlord law again.

LandlordShield monitors rental legislation across all 50 US states in real-time and delivers plain-English summaries — with exactly what to update in your lease — the moment a law changes.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend + API routes | Next.js 14 (App Router) |
| Database + Auth | Supabase (PostgreSQL) |
| AI summaries | Gemini 2.0 Flash (Google AI Studio) |
| Law data | LegiScan API |
| Email alerts | Resend |
| Payments | Stripe |
| Hosting | Vercel |
| Map | D3 + us-atlas TopoJSON |

---

## Project Structure

```
landlordshield/
├── app/
│   ├── layout.js                    ← Root layout, fonts, metadata
│   ├── globals.css                  ← Global styles + animations
│   ├── page.jsx                     ← Landing page
│   ├── auth/page.jsx                ← Sign up / sign in
│   ├── onboarding/page.jsx          ← State + property type setup
│   ├── dashboard/page.jsx           ← Main user dashboard
│   └── api/
│       ├── check-laws/route.js      ← Daily cron: LegiScan → Gemini → DB
│       ├── send-alerts/route.js     ← Email affected users via Resend
│       ├── ask-the-law/route.js     ← Gemini Q&A endpoint
│       └── stripe-webhook/route.js  ← Handle subscription events
├── components/
│   ├── LandingPage.jsx
│   ├── AuthForm.jsx
│   ├── OnboardingFlow.jsx
│   ├── Dashboard.jsx
│   └── ui/
│       ├── USMap.jsx                ← Real SVG map (d3 + us-atlas)
│       ├── ScoreRing.jsx            ← Animated compliance score ring
│       ├── AskTheLaw.jsx            ← AI chat interface
│       └── AlertCard.jsx            ← Individual law alert card
├── lib/
│   ├── constants.js                 ← Colors, state data, FIPS map, helpers
│   ├── supabase.js                  ← DB client + auth helpers
│   ├── gemini.js                    ← AI summary + Q&A functions
│   ├── legiscan.js                  ← Bill fetching + parsing
│   └── resend.js                    ← Email templates + sending
├── .env.example                     ← All required env vars documented
├── vercel.json                      ← Cron job: /api/check-laws at 08:00 UTC daily
└── supabase-schema.sql              ← Run this in Supabase SQL editor
```

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/yourusername/landlordshield.git
cd landlordshield
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local`. See comments in the file for where to get each key.

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the SQL editor and paste + run the contents of `supabase-schema.sql`
3. Copy your project URL and keys into `.env.local`

### 4. Set up Stripe

1. Create products in Stripe dashboard:
   - **Free** — $0/month (for tracking purposes)
   - **Pro** — $19/month
2. Copy keys into `.env.local`
3. For local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe-webhook`

### 5. Get your API keys

| Service | Where to get it |
|---|---|
| Gemini | [aistudio.google.com](https://aistudio.google.com) → Get API key (free) |
| LegiScan | [legiscan.com/legiscan-api](https://legiscan.com/legiscan-api) → Register (free tier) |
| Resend | [resend.com](https://resend.com) → API Keys → verify your domain |

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How the daily cron works

```
Vercel Cron (08:00 UTC)
  → GET /api/check-laws  (protected by CRON_SECRET)
  → fetchLandlordBills(state) from LegiScan API
  → Filter bills by landlord keywords
  → getBillText() for each relevant bill
  → summarizeLaw() via Gemini → plain-English JSON
  → INSERT into law_alerts table in Supabase
  → POST /api/send-alerts for each new alert
  → Find users with properties in that state
  → sendLawAlert() via Resend to each affected user
```

---

## Deploying to Vercel

```bash
# Push to GitHub first, then:
vercel deploy
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

The cron job in `vercel.json` runs automatically on Vercel's infrastructure once deployed. No additional setup needed.

---

## Supabase Schema

Run `supabase-schema.sql` in your Supabase SQL editor. It creates:

- `users` — auth + subscription info
- `properties` — user's rental properties by state
- `law_alerts` — processed law changes with AI summaries
- `user_alerts` — which alerts have been sent to which users
- `ai_queries` — anonymised Q&A logs

---

## Roadmap

- [ ] Lease clause generator (auto-draft exact language to add/remove)
- [ ] Compliance deadline calendar with Google Calendar sync
- [ ] White-label version for property management companies
- [ ] UK & Canada coverage
- [ ] Stripe billing portal page
- [ ] Mobile app (React Native)

---

## License

MIT — build something great.
