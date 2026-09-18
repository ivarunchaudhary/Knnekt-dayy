"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven fog over the hero picture.
 *
 * Leaving the hero, a tinted haze gathers from the bottom of the frame and
 * swallows the hands, then burns off into the white of the page below. Two
 * curves, both read off one scroll progress `p` (0 at rest, 1 when the hero has
 * travelled a full viewport):
 *
 *   --haze  the colour field. Ramps in over the first half and then holds, so
 *           the tint arrives early enough to be seen before the white takes over.
 *   --veil  the white wash. Held back until the haze has established itself,
 *           then smoothstepped to full, which is what actually dissolves the
 *           picture into <Intro/>. Bottom-weighted, so the wordmark and the
 *           claim at the top of the frame stay legible for as long as they're
 *           on screen.
 *
 * Progress is written as two custom properties on one wrapper rather than as
 * React state: the effect has to track the scrollbar frame for frame, and a
 * setState per frame would re-render the tree for a number only CSS consumes.
 *
 * Reduced motion keeps the fade — it is the page transition, not decoration —
 * and drops only the idle drift, which is `motion-safe` on the field itself.
 */
export default function HeroFog() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const span = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / span));

      const haze = Math.min(1, p / 0.55);
      const t = Math.min(1, Math.max(0, (p - 0.3) / 0.7));
      const veil = t * t * (3 - 2 * t);

      node.style.setProperty("--haze", haze.toFixed(3));
      node.style.setProperty("--veil", veil.toFixed(3));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      style={{ "--haze": 0, "--veil": 0 } as React.CSSProperties}
    >
      {/* The colour field overhangs the frame so it can drift and rise without
          ever pulling a hard edge into shot. Inside it, three banks on their own
          clocks: the haze's leading edge is the sum of the three, so it stays
          uneven across the width and never reads as one bar sliding. */}
      <div
        className="absolute -inset-x-[20%] -bottom-[30%] h-[130%]"
        style={{ opacity: "var(--haze)", transform: "translate3d(0, calc((1 - var(--haze)) * 14%), 0)" }}
      >
        <div className="hero-fog-a motion-safe:animate-fog-a absolute inset-0" />
        <div className="hero-fog-b motion-safe:animate-fog-b absolute inset-0" />
        <div className="hero-fog-c motion-safe:animate-fog-c absolute inset-0" />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(to_top,#fff_0%,#f6fafe_46%,rgba(255,255,255,0)_100%)]"
        style={{ opacity: "var(--veil)" }}
      />
      {/* The hero's foot, resolved to the white of the page. Last of the three, so
          the seam against <Intro/> stays clean at every point in the scroll — under
          the fog it would be a band of colour cut off on a hard line. */}
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
