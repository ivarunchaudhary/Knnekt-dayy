import { pricing } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import ScoreButton from "./ScoreButton";

/** A rounded tile with a line icon in it, drawn in a 64-unit box centred on 0,0 — the same tile the "in pieces" cards use. */
function Tile({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="-32 -32 64 64" className={`size-11 shrink-0 ${className}`}>
      <rect x="-28" y="-28" width="56" height="56" rx="10" fill="url(#ks-tile)" stroke="#16253f" strokeWidth="3.5" />
      <g fill="none" stroke="#16253f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </g>
    </svg>
  );
}

const facts = [
  ["100%", "one full scholarship, every cohort"],
  ["20–30% off", "on four scholarship tracks"],
  ["Within 24 hours", "decided with your seat"],
];

const star = "M0 -15L4.4 -6L14.3 -4.6L7.2 2.3L8.9 12.2L0 7.5L-8.9 12.2L-7.2 2.3L-14.3 -4.6L-4.4 -6Z";

const tracks = [
  {
    name: "Women Founders",
    for: "For women who lead their startup as founder or co-founder.",
    off: "20% off the fee",
    amount: "₹60,000",
    icon: "M-6 -8a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M-13 14Q-13 2 0 2Q13 2 13 14",
  },
  {
    name: "Beyond the Metros",
    for: "For founders building from tier-2 cities, who move to Gurugram for the 100 days.",
    off: "20% off the fee",
    amount: "₹60,000",
    icon: "M-13 14V-2L-5 -7V14M-5 14V-13L5 -17V14M5 14V-3L13 1V14M-16 14H16",
  },
  {
    name: "Second-time Founders",
    for: "For founders who have built before, whether it worked or not.",
    off: "20–30% off the fee",
    amount: "₹60,000–90,000",
    icon: "M-12 0A12 12 0 1 0 -8.5 -8.5M-8.5 -8.5L-8.5 -15M-8.5 -8.5L-2 -8.5M0 -6V0L4 3",
  },
  {
    name: "Need-based",
    for: "For strong founders for whom the fee is the only thing in the way.",
    off: "20–25% off the fee",
    amount: "₹60,000–75,000",
    icon: "M0 13C-10 6 -14 1 -14 -5A7 7 0 0 1 0 -8A7 7 0 0 1 14 -5C14 1 10 6 0 13Z",
  },
];

/**
 * Scholarships: one full scholarship a cohort and four tracks off the fee.
 * There is no separate form; founders ask in the Score and the panel decides
 * at the Selection Session. Set on the feature panel like the fee card, with
 * the tracks as white cards on it, so it reads as the next line of the price.
 */
export default function Scholarships() {
  return (
    <section id="scholarships" className="py-12 md:py-28">
      <Container as="div">
        <SectionHeading lead="Scholarships.">
          One full scholarship every cohort, and 20–30% off the fee on four tracks. There’s no separate application: tell us in the
          Score, and we decide at your Selection Session.
        </SectionHeading>

        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="ks-tile" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#cfe3fa" />
            </linearGradient>
          </defs>
        </svg>

        <div className="bg-panel mt-12 rounded-xl p-4 sm:p-6 md:p-10 lg:mt-20">
          <ul className="grid gap-6 border-b border-dark/15 px-2 pb-8 sm:px-0 md:grid-cols-3" aria-label="Scholarships at a glance">
            {facts.map(([big, small]) => (
              <li key={big}>
                <p className="text-3xl leading-none font-medium md:text-4xl">{big}</p>
                <p className="mono-text mt-3 font-mono text-dark/70">{small}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 rounded-lg bg-white p-5 shadow-[inset_0_0_0_2px_var(--color-sky-deep),0_22px_44px_-30px_rgb(22_37_63/0.45)] md:grid-cols-[auto_1fr_auto] md:p-7">
            <Tile d={star} />
            <div>
              <p className="mono-text font-mono text-sky-deep">Once per cohort</p>
              <h3 className="mt-1.5 text-xl font-medium lg:text-2xl">The Full Scholarship: 100% of the fee</h3>
              <p className="text-dark-subtle mt-1.5 max-w-[60ch] text-xs leading-tight">
                For one founder each cohort, chosen by the panel from everyone who asks to be considered, on any track.
              </p>
            </div>
            <p className="col-span-2 flex items-baseline gap-3 md:col-span-1 md:flex-col md:items-end md:gap-1.5">
              <span className="text-3xl leading-none font-medium">{pricing.fee}</span>
              <span className="mono-text font-mono text-dark/70">the whole fee</span>
            </p>
          </div>

          <ul className="mt-1.5 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Scholarship tracks">
            {tracks.map((t) => (
              <li
                key={t.name}
                className="flex flex-col rounded-lg bg-white p-5 shadow-[inset_0_0_0_1px_rgb(22_37_63/0.08)] transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 md:p-6"
              >
                <Tile d={t.icon} />
                <h3 className="mt-5 text-lg font-medium">{t.name}</h3>
                <p className="text-dark-subtle mt-1.5 mb-6 text-xs leading-tight">{t.for}</p>
                <p className="mt-auto border-t border-dark/10 pt-4">
                  <span className="block font-medium">{t.off}</span>
                  <span className="mono-text mt-1.5 block font-mono text-dark/70">{t.amount}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-1.5 flex items-start gap-3 rounded-xl border border-dark/10 bg-gray-100 p-5 text-sm leading-tight md:p-6">
          <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-md bg-sky-deep text-white">
            <svg viewBox="0 0 16 16" fill="none" className="size-4">
              <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            Tick <span className="font-medium">“Consider me for a scholarship”</span> and pick the track that fits in the application.
          </span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-6 border-t border-dark/10 pt-8">
          <p className="text-dark-subtle max-w-[56ch] text-xs leading-tight">
            Awarded by the selection panel, one scholarship per founder; tracks can’t be combined. The number of scholarships varies by
            cohort. Our two promises apply as normal.
          </p>
          <ScoreButton className="mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap">
            Take the Startup Operating Score
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
            >
              →
            </span>
          </ScoreButton>
        </div>
      </Container>
    </section>
  );
}
