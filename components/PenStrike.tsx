"use client";

import { useEffect, useRef, type ReactNode } from "react";

const DRAW_HOLD = 2600;
const LIFT = 380;
const GAP = 450;

/**
 * Strikes its words through like a pen, on a loop: draw, hold, lift away, draw
 * again. It only runs while the words are on screen and the tab is visible;
 * with reduced motion the stroke is simply drawn and left there.
 */
export default function PenStrike({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-crossed");
      return;
    }

    let timer = 0;
    let running = false;
    let inView = false;
    const cycle = () => {
      el.classList.remove("is-lifting", "is-crossed");
      void el.offsetWidth; // reset instantly so the stroke draws from the start
      el.classList.add("is-crossed");
      timer = window.setTimeout(() => {
        el.classList.add("is-lifting");
        timer = window.setTimeout(() => {
          el.classList.remove("is-crossed", "is-lifting");
          timer = window.setTimeout(cycle, GAP);
        }, LIFT);
      }, DRAW_HOLD);
    };
    const start = () => {
      if (running) return;
      running = true;
      timer = window.setTimeout(cycle, 600);
    };
    const stop = () => {
      running = false;
      clearTimeout(timer);
      el.classList.remove("is-crossed", "is-lifting");
    };
    const sync = () => (inView && !document.hidden ? start() : stop());

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      clearTimeout(timer);
    };
  }, []);

  return (
    <span ref={ref} className="pen-strike">
      {children}
      <svg className="pen-strike-ink" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 24 C 30 19, 58 24, 88 19 S 145 17, 172 16 S 194 13, 198 12" />
      </svg>
    </span>
  );
}
