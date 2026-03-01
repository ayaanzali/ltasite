# LTA UTD — Law and Trial Association at UT Dallas

Modern website for LTA at the University of Texas at Dallas. Built with **Next.js 15**, **Tailwind CSS**, and **Framer Motion**, deployed on **Vercel**.

## Run locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env.local` and fill in:
   - `AIRTABLE_API_KEY` — Airtable personal access token
   - `AIRTABLE_BASE_ID` — Your Airtable base ID
   - `ANTHROPIC_API_KEY` — Anthropic API key for the chatbot

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Airtable setup

Create a base with:

- **Events** table: fields `Name`, `Date`, `Location`, `Description` (or update `lib/airtable.ts` to match your field names).
- **Join** table: fields `Name`, `Email`, `Major`, `Grad Year`.
- **RSVPs** table: fields `Event ID`, `Event Name`, `Name`, `Email`.

Use the same field names in the API or adjust the server code to match your schema.

## Deploy on Vercel

1. Push the repo to GitHub and import the project in Vercel.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `ANTHROPIC_API_KEY`
3. Redeploy. The site will use these env vars (never exposed to the client).

## Content to replace

Before launch, replace placeholder content in:

- **Hero**: tagline in `components/Hero.tsx`
- **About**: mission statement and value card copy in `components/About.tsx`
- **Events**: optional subheading in `components/Events.tsx`
- **Officers**: names, titles, headshots, LinkedIn URLs in `components/Officers.tsx` (or switch to data from Airtable/CMS)
- **Get Involved**: short intro line in `components/GetInvolved.tsx`
- **Footer**: Instagram URL, LinkedIn URL, and contact email in `components/Footer.tsx`

Add your LTA logo by replacing the logo block in `Hero.tsx` with an `<Image>` (e.g. from `/public/logo.png`).

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS
- Framer Motion
- Serverless API routes: `/api/join`, `/api/rsvp`, `/api/chat`
- Airtable for events (server-side fetch) and form/RSVP storage
- Anthropic Claude for the LTA-only chatbot
