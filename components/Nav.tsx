"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MobileHeader from "./MobileHeader";

const items = [
  { href: "#score", label: "Score", blurb: "The free diagnostic" },
  { href: "#services", label: "Services", blurb: "Four functions, one team" },
  { href: "#pricing", label: "Pricing", blurb: "One price, two promises" },
  { href: "#community", label: "Studio", blurb: "Masterclasses and the team" },
  { href: "#faq", label: "FAQ", blurb: "Questions founders ask" },
  { href: "#contact", label: "Contact", blurb: "Take the score, talk to us" },
];

const spring =
  "before:ease-[linear(0,0.468_6.8%,0.822_14.1%,1.064_21.9%,1.146_26.1%,1.205_30.6%,1.231_33.9%,1.246_37.4%,1.25_41.1%,1.243_45.1%,1.208_52.6%,1.087_70.3%,1.039_79.1%,1.008_88.9%,1)]";

const mask = ({ start, end }: { start: boolean; end: boolean }) =>
  `linear-gradient(to right, ${start ? "black" : "transparent"} 0%, black 1.25rem, black calc(100% - 1.25rem), ${end ? "black" : "transparent"} 100%)`;

/**
 * Floating pill navigation. The dot marks whichever section currently fills the
 * viewport. Off the home page the same links point back at it, so the pill is
 * never a row of dead anchors on a case or legal page. On a phone the pill
 * gives way to <MobileHeader/> (see `[data-nav]` in globals.css).
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const row = useRef<HTMLDivElement>(null);
  const onHome = usePathname() === "/en";

  // On a phone the row is wider than the pill. Fade only the side that has more
  // links behind it (at rest that is the right, so "Score" isn't half-hidden),
  // and keep the marked link in view as the sections go by, or the dot would
  // land on a link scrolled out of sight.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const start = el.scrollLeft <= 1;
      const end = el.scrollLeft >= max - 1;
      setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const el = row.current;
    const link = active && el?.querySelector<HTMLElement>(`a[href="${active}"]`);
    if (!el || !link || el.scrollWidth <= el.clientWidth) return;
    const left = link.offsetLeft - (el.clientWidth - link.offsetWidth) / 2;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  useEffect(() => {
    if (!onHome) return;
    const sections = items.map((i) => document.querySelector<HTMLElement>(i.href)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const marker = window.innerHeight * 0.5;
      let current: string | null = null;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= marker && r.bottom > marker) current = `#${s.id}`;
      }
      setActive(current);
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
    };
  }, [onHome]);

  return (
    <>
      <MobileHeader items={items} home={onHome ? "" : "/en"} />
      <nav aria-label="Sections" data-nav className="fixed bottom-7 left-1/2 isolate z-40 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-hidden rounded-full bg-gray-200/70 py-1.5 pr-5 pl-2.5 text-[0.9375rem] leading-[125%] font-medium tracking-[-0.00938rem] backdrop-blur-xl">
        {/* Five items don't fit a phone: the row scrolls, and the mask doubles as the affordance. */}
        <div
          ref={row}
          className="hide-scrollbars -mr-4 -ml-1.5 overflow-x-auto overscroll-x-contain pr-4 pl-1.5"
          style={{ maskImage: mask(edges), WebkitMaskImage: mask(edges) }}
        >
          <ul className="flex w-max select-none">
            {items.map((item) => {
              const on = active === item.href;
              const className = `before:bg-dark flex items-center gap-1 rounded-full px-2 py-3 outline-dark transition-colors before:size-2.5 before:rounded-full before:transition before:duration-200 ${spring} hover:text-dark focus-visible:text-dark ${
                on
                  ? "text-dark before:opacity-100 motion-safe:before:translate-y-0"
                  : "text-dark-subtle before:opacity-0 motion-safe:before:translate-y-2"
              }`;
              const label = <span className="-mt-0.5">{item.label}</span>;
              return (
                <li key={item.href}>
                  {onHome ? (
                    <a href={item.href} aria-current={on ? "location" : undefined} className={className}>
                      {label}
                    </a>
                  ) : (
                    <Link href={`/en${item.href}`} className={className}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
