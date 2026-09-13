# Knnekt Studios homepage

India's first Startup Execution Studio: one honest score, fifteen founders a quarter, one 90-day build.

Built with **Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript**. The layout started as a pixel-faithful rebuild of [dayy.com/en](https://www.dayy.com/en).

## Run

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en
npm run build && npm start
```

## Structure

- `app/en/page.tsx` – the homepage, assembled from section components
- `components/` – `Nav`, `Hero` (wordmark + claim), `Wordmark`, `Intro` (claim + facts marquee), `Work` (the proof grid), `Services` (the four pillars, sticky stacking cards), `Collaboration` (agency vs. execution partner, Swiper), `Facts` (cohort, 90 days, score), `Journey` (the 90-day spine — scroll-driven day counter, filling rail, phases lighting up), `Culture` (what the 90 days includes, Swiper), `Contact`, `Footer`
- `lib/data.ts` – all copy, image paths and Vimeo IDs
- `app/globals.css` – the site's design tokens (colours, fluid type scale, grain animation) as a Tailwind v4 `@theme`
- `app/fonts/` – FT System Blank / FT System Mono (self-hosted, loaded with `next/font/local`)
- `public/sanity/` – every image from the original page, `public/videos/` – hero gradient loops

Engagement pages (`/en/case/<slug>`) render the full proof entry from `lib/data.ts`; legal pages are placeholders so no link 404s.
