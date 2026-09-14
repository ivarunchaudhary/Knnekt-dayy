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
- `components/` – `Nav`, `Hero` (wordmark + claim), `Wordmark`, `Intro` (claim + facts marquee), `Work` (the proof grid), `Services` (the four pillars, sticky stacking cards), `Collaboration` (agency vs. execution partner, Swiper), `Facts` (cohort, 90 days, score), `Journey` (the 90-day spine — scroll-driven day counter, filling rail, phases lighting up), `Faculty` (who takes the classes — investors, then the execution team), `Testimonials` (two ticker rows running opposite ways), `Pricing` (three published plans + the terms behind all of them), `Insights` (three latest pieces) with `PostCard`, `Contact` (claim + `ContactForm`), `Footer`
- `lib/data.ts` – all copy, image paths and Vimeo IDs
- `app/globals.css` – the site's design tokens (colours, fluid type scale, grain animation) as a Tailwind v4 `@theme`
- `app/fonts/` – FT System Blank / FT System Mono (self-hosted, loaded with `next/font/local`)
- `public/sanity/` – every image from the original page, `public/images/` – hero still, grain and marks
- `app/opengraph-image.tsx` – the 1200×630 link preview (hero frame + wordmark + claim), with `app/twitter-image.tsx` pointing X at the same card and `app/icon.svg` / `app/apple-icon.tsx` the favicon and home-screen icon; `assets/` holds what those generate from — ttf cuts of the brand font and a pre-cropped hero jpg, since Satori reads neither woff2 nor webp

Engagement pages (`/en/case/<slug>`) render the full proof entry from `lib/data.ts`; legal pages are placeholders so no link 404s.

Insights live at `/en/insights` (index) and `/en/insights/<slug>` (article). Post bodies are a small block vocabulary in `lib/data.ts` — `{ h }`, `{ p }`, `{ list }`, `{ quote }` — so copy stays data rather than markup.

Two things are deliberately stubbed and marked as such in the code:

- **Faculty** cards lead with the *seat* ("Seed investor · Consumer") and carry a "named at kickoff" chip. Add a `name` to a member in `lib/data.ts` and the card promotes it and drops the chip.
- **The contact form** has no inbox behind it yet: a valid submission composes a `mailto:` carrying every field. Replace the body of `onSubmit` in `components/ContactForm.tsx` with a server action when an email provider is wired up — the validation and states around it don't change.
