import type { CSSProperties, ReactNode } from "react";
import { pricing } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import ScoreButton from "./ScoreButton";

const facts = [
  ["100%", "one full scholarship, every cohort"],
  ["20–30% off", "on four scholarship tracks"],
  ["Within 24 hours", "decided with your seat"],
];

const tracks: { name: string; for: string; off: string; amount: string; colour: string; icon: ReactNode }[] = [
  {
    name: "Women Founders",
    for: "For women who lead their startup as founder or co-founder.",
    off: "20% off the fee",
    amount: "₹60,000",
    colour: "#ff7a6b",
    icon: (
      <>
        <circle cx="24" cy="16" r="7" fill="currentColor" />
        <path d="M10 40c1-9 7-14 14-14s13 5 14 14z" fill="currentColor" />
        <path d="M33 9l2 4 4 .6-3 2.9.7 4.1L33 18.7l-3.7 1.9.7-4.1-3-2.9 4-.6z" fill="#ffc24b" />
      </>
    ),
  },
  {
    name: "Beyond the Metros",
    for: "For founders building from tier-2 cities, who move to Gurugram for the 100 days.",
    off: "20% off the fee",
    amount: "₹60,000",
    colour: "#34c9a0",
    icon: (
      <>
        <path d="M8 40V22l8-5v23M16 40V14l10-6v32M26 40V20l14 6v14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="4" fill="#ffc24b" />
      </>
    ),
  },
  {
    name: "Second-time Founders",
    for: "For founders who have built before, whether it worked or not.",
    off: "20–30% off the fee",
    amount: "₹60,000–90,000",
    colour: "#8b7cf6",
    icon: (
      <>
        <path d="M14 30a12 12 0 1 1 4 9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M10 26l4 5 5-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 18v8l5 3" fill="none" stroke="#ffc24b" strokeWidth="3.2" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Need-based",
    for: "For strong founders for whom the fee is the only thing in the way.",
    off: "20–25% off the fee",
    amount: "₹60,000–75,000",
    colour: "#3b81e3",
    icon: (
      <>
        <path d="M24 40C12 32 7 25 7 18a8.5 8.5 0 0 1 17-2 8.5 8.5 0 0 1 17 2c0 7-5 14-17 22z" fill="currentColor" />
        <path d="M19 22h10M24 17v10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
];

/**
 * Scholarships: one full scholarship a cohort and four tracks off the fee.
 * There is no separate form; founders ask in the Score and the panel decides
 * at the Selection Session. The facts, the full scholarship and the tracks sit
 * on one deep-sky panel, each track a white card keyed in its own colour.
 */
export default function Scholarships() {
  return (
    <section id="scholarships" className="py-12 md:py-28">
      <Container as="div">
        <SectionHeading lead="Scholarships.">
          One full scholarship every cohort, and 20–30% off the fee on four tracks. There’s no separate application: tell us in the
          Score, and we decide at your Selection Session.
        </SectionHeading>

        <div className="ks-panel">
          <ul className="ks-facts" aria-label="Scholarships at a glance">
            {facts.map(([big, small]) => (
              <li key={big}>
                <b>{big}</b>
                <span>{small}</span>
              </li>
            ))}
          </ul>

          <div className="ks-full">
            <span className="ks-ico ks-ico-full">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 6l5.2 10.6 11.7 1.7-8.5 8.2 2 11.6L24 32.6l-10.4 5.5 2-11.6-8.5-8.2 11.7-1.7z" fill="currentColor" />
              </svg>
            </span>
            <div className="ks-full-text">
              <p className="ks-full-kicker mono-text font-mono">Once per cohort</p>
              <p className="ks-full-name">The Full Scholarship: 100% of the fee</p>
              <p className="ks-full-for">For one founder each cohort, chosen by the panel from everyone who asks to be considered, on any track.</p>
            </div>
            <p className="ks-full-amt">
              <b>{pricing.fee}</b>
              <span>the whole fee</span>
            </p>
          </div>

          <ul className="ks-cards" aria-label="Scholarship tracks">
            {tracks.map((t) => (
              <li key={t.name} className="ks-card" style={{ "--c": t.colour } as CSSProperties}>
                <span className="ks-ico">
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    {t.icon}
                  </svg>
                </span>
                <p className="ks-name">{t.name}</p>
                <p className="ks-for">{t.for}</p>
                <p className="ks-award">
                  <b>{t.off}</b>
                  <span>{t.amount}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="ks-apply">
          <span className="ks-tick" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d="M5 10.5l3.2 3.2L15 7" />
            </svg>
          </span>
          <span>
            Tick <b>“Consider me for a scholarship”</b> and pick the track that fits in the application.
          </span>
        </p>

        <div className="ks-foot">
          <p className="ks-fine">
            Awarded by the selection panel, one scholarship per founder; tracks can’t be combined. The number of scholarships varies by
            cohort. Our two promises apply as normal.
          </p>
          <p className="ks-cta">
            <ScoreButton className="mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap">
              Take the Startup Operating Score
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
              >
                →
              </span>
            </ScoreButton>
          </p>
        </div>
      </Container>
    </section>
  );
}
