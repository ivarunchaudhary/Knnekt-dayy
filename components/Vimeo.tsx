"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  title: string;
  className?: string;
  /** Render as a covering background inside a positioned box */
  cover?: boolean;
  /** Real width/height ratio of the clip (Vimeo letterboxes anything else) */
  aspect?: number;
  /** Start loading immediately instead of when scrolled near */
  eager?: boolean;
};

/**
 * Chromeless, looping, muted Vimeo background embed (same params dayy.com uses).
 * A local poster frame shows instantly; the player loads when it comes near the
 * viewport and fades in over the poster once ready.
 */
export default function Vimeo({ id, title, className = "", cover, aspect = 16 / 9, eager = false }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  // cover mode: size the iframe like `object-fit: cover` using the clip's real aspect ratio
  useEffect(() => {
    if (!cover || !visible) return;
    const el = box.current;
    const f = frame.current;
    if (!el || !f) return;
    const fit = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (!w || !h) return;
      const iw = w / h > aspect ? w : h * aspect;
      f.style.width = `${Math.ceil(iw)}px`;
      f.style.height = `${Math.ceil(iw / aspect)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cover, aspect, visible]);

  const src = `https://player.vimeo.com/video/${id}?autopause=0&dnt=1&loop=1&background=1&app_id=122963`;

  return (
    <div
      ref={box}
      className={cover ? "absolute inset-0 overflow-hidden" : `relative overflow-hidden ${className}`}
      style={cover ? undefined : { aspectRatio: `${aspect}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden="true"
        src={`/posters/${id}.webp`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      {visible && (
        <iframe
          ref={frame}
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          className={`${cover ? "vimeo-cover" : "vimeo-inline"} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
