# Knnekt Studios homepage

Built with **Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript**. The layout started as a pixel-faithful rebuild of [dayy.com/en](https://www.dayy.com/en).

## Run

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en
npm run build && npm start
```

## Structure

- `app/en/page.tsx` – the homepage, assembled from section components
- `components/` – `Nav`, `Hero` (wordmark + claim), `Wordmark`, `Intro` (logo marquee), `Work` (case grid), `Services` (sticky stacking cards), `Collaboration` (Swiper), `Facts`, `Culture` (Swiper), `Contact`, `Footer`
- `lib/data.ts` – all copy, image paths and Vimeo IDs
- `app/globals.css` – the site's design tokens (colours, fluid type scale, grain animation) as a Tailwind v4 `@theme`
- `app/fonts/` – FT System Blank / FT System Mono (self-hosted, loaded with `next/font/local`)
- `public/sanity/` – every image from the original page, `public/videos/` – hero gradient loops

Case-study and legal pages exist as placeholders so no link 404s.
