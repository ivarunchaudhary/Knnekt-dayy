"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "#work", label: "Proof" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "Studio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" },
];

const spring =
  "before:ease-[linear(0,0.468_6.8%,0.822_14.1%,1.064_21.9%,1.146_26.1%,1.205_30.6%,1.231_33.9%,1.246_37.4%,1.25_41.1%,1.243_45.1%,1.208_52.6%,1.087_70.3%,1.039_79.1%,1.008_88.9%,1)]";

/**
 * Floating pill navigation. The dot marks whichever section currently fills the
 * viewport. Off the home page the same links point back at it, so the pill is
 * never a row of dead anchors on a case or legal page.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const onHome = usePathname() === "/en";

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
    <nav className="fixed bottom-7 left-1/2 isolate z-40 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-hidden rounded-full bg-gray-200/70 py-1.5 pr-5 pl-2.5 text-[0.9375rem] leading-[125%] font-medium tracking-[-0.00938rem] backdrop-blur-xl">
      {/* Six items don't fit a phone: the row scrolls, and the mask doubles as the affordance. */}
      <div
        className="hide-scrollbars -mr-4 -ml-1.5 overflow-x-auto overscroll-x-contain pr-4 pl-1.5"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 1.25rem, black calc(100% - 1.25rem), transparent 100%)" }}
      >
        <ul className="flex w-max select-none">
          {items.map((item) => {
            const on = active === item.href;
            const className = `before:bg-dark flex items-center gap-1 rounded-full px-2 py-3 outline-black transition-colors before:size-2.5 before:rounded-full before:transition before:duration-200 ${spring} hover:text-dark focus-visible:text-dark ${
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
  );
}
