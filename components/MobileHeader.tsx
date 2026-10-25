"use client";

import { useEffect, useRef, useState } from "react";
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/lib/brand";
import ScoreDialog from "./ScoreDialog";

export type MobileHeaderItem = { href: string; label: string; blurb: string };

/**
 * The phone layer (below 48rem, where the floating pill is hidden): a top bar
 * that turns solid once the page scrolls, hides while reading down past the
 * hero and comes back on the way up, and a full-screen menu behind it. Off the
 * home page there is no hero to sit over, so the bar is solid from the start.
 *
 * The Score dialog is mounted here at the root rather than inside the sheet:
 * the sheet turns `inert` as it closes, and that would take the dialog with it.
 */
export default function MobileHeader({ items, home }: { items: MobileHeaderItem[]; home: string }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const mq = matchMedia("(max-width: 47.99rem)");
    let lastY = scrollY;
    const onScroll = () => {
      if (!mq.matches || document.documentElement.classList.contains("mh-open")) return;
      const hero = document.querySelector<HTMLElement>("header[data-hero]");
      const y = scrollY;
      const heroEnd = hero ? hero.offsetHeight - 72 : 300;
      el.classList.toggle("is-solid", !hero || y > 24);
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (down && y > heroEnd) el.classList.add("is-hidden");
      else if (up || y <= heroEnd) el.classList.remove("is-hidden");
      lastY = y;
    };
    const onChange = () => {
      if (!mq.matches) setOpen(false);
      onScroll();
    };
    addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onChange);
    onScroll();
    return () => {
      removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("mh-open", open);
    document.body.classList.toggle("mh-lock", open);
    if (sheet.current) sheet.current.inert = !open;
    if (open) {
      opened.current = true;
      bar.current?.classList.remove("is-hidden");
      const t = setTimeout(() => sheet.current?.querySelector("a")?.focus({ preventScroll: true }), 250);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      addEventListener("keydown", onKey);
      return () => {
        clearTimeout(t);
        removeEventListener("keydown", onKey);
      };
    }
    if (opened.current) toggle.current?.focus({ preventScroll: true });
  }, [open]);

  const takeScore = () => {
    setOpen(false);
    setScore(true);
  };

  return (
    <div className="mh-wrap" data-mh-root>
      <header ref={bar} className="mh" data-mh>
        <a className="mh-logo" href={home ? `${home}#main` : "#main"} aria-label="Knnekt Studios, back to top">
          <svg viewBox={WORDMARK_VIEWBOX} aria-hidden="true" className="mh-mark">
            <path d={WORDMARK_PATH} />
          </svg>
        </a>
        <div className="mh-right">
          <button type="button" className="mh-cta" data-score-cta="mobile_header" onClick={takeScore}>
            Take the Score
          </button>
          <button
            ref={toggle}
            type="button"
            className="mh-menu"
            aria-expanded={open}
            aria-controls="mh-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div ref={sheet} className="mh-sheet" id="mh-sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Sections, mobile">
          <ol className="mh-list">
            {items.map((item, i) => (
              <li key={item.href}>
                <a href={`${home}${item.href}`} onClick={() => setOpen(false)}>
                  <span className="mh-n mono-text font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mh-t">{item.label}</span>
                  <span className="mh-d">{item.blurb}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mh-foot">
          <button type="button" className="mh-big w-full text-left" data-score-cta="mobile_menu" onClick={takeScore}>
            Take the free Startup Operating Score
            <span aria-hidden="true">→</span>
          </button>
          <p className="mh-meta mono-text font-mono">Cohort 01 · 15 seats · Gurugram</p>
          <a className="mh-mail" href="mailto:hello@knnekt.studio">
            hello@knnekt.studio
          </a>
        </div>
      </div>
      {score && <ScoreDialog onClose={() => setScore(false)} />}
    </div>
  );
}
