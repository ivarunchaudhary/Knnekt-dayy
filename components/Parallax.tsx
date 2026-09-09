"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** vertical (default) moves an oversized child up as you scroll; horizontal moves it sideways while a slider drags */
  axis?: "y" | "x";
  /** overflow percentage of the child (13 => h-[113%], 18 => w-[118%]) */
  amount?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Reproduces the site's "oversized image that drifts inside its frame" effect.
 * The wrapper is the frame; the child is 113% tall (or 118% wide) and is
 * translated by up to -amount% based on the frame's position in the viewport.
 */
export default function Parallax({ children, axis = "y", amount = axis === "y" ? 13 : 18, className = "", style }: Props) {
  const frame = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const f = frame.current;
    const i = inner.current;
    if (!f || !i) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = f.getBoundingClientRect();
      let p: number;
      if (axis === "y") {
        const vh = window.innerHeight;
        p = (vh - r.top) / (vh + r.height);
      } else {
        const vw = window.innerWidth;
        p = (vw - r.left) / (vw + r.width);
      }
      p = Math.min(1, Math.max(0, p));
      const t = -(p * amount);
      i.style.transform = axis === "y" ? `translate3d(0, ${t}%, 0)` : `translate3d(${t}%, 0, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(f);
    // horizontal sliders move without a window scroll event → poll while visible
    let poll = 0;
    if (axis === "x") poll = window.setInterval(schedule, 50);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (poll) clearInterval(poll);
    };
  }, [axis, amount]);

  return (
    <span ref={frame} className={`block overflow-hidden ${className}`} style={style}>
      <span ref={inner} className={axis === "y" ? "block h-[113%]" : "block w-[118%]"} style={{ willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
