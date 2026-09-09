"use client";

import { useEffect, useRef, useState } from "react";

const sources = {
  mobile: { src: "/videos/gradient--mobile.mp4", poster: "/videos/gradient--mobile.webp" },
  desktop: { src: "/videos/gradient--desktop.mp4", poster: "/videos/gradient--desktop.webp" },
} as const;

/**
 * Animated dark gradient video + film grain, used behind the hero and contact card.
 * Only the clip for the current breakpoint is downloaded; a poster frame paints first.
 * `eager` (hero) starts the download immediately, otherwise it waits until scrolled near.
 */
export default function GradientBackground({ eager = false }: { eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<keyof typeof sources | null>(null);
  const [near, setNear] = useState(eager);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const pick = () => setVariant(mq.matches ? "desktop" : "mobile");
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const v = variant ? sources[variant] : sources.desktop;

  return (
    <div
      ref={ref}
      className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-cover bg-center after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5"
      style={{ backgroundImage: `url(${v.poster})` }}
    >
      {variant && near && (
        <video
          key={v.src}
          ref={(el) => {
            // React sets `muted` as a property only; make it explicit and kick off playback
            if (el) {
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          className="size-full object-cover"
          src={v.src}
          poster={v.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}
