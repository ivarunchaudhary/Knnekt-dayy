import { feeIncludes, ledgerIn, ledgerOut, paymentSteps, pricing, pricingFacts } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import ScoreButton from "./ScoreButton";

/**
 * One fee, and everything a founder needs to decide about it: the promises we
 * make about the number, the schedule it leaves their account on, the market
 * rate it's set against, and a card that holds the figure, what it covers and
 * the way in, with the two promises underneath. The ledger closes it out —
 * what the fee buys, and what deliberately stays on their card.
 */

const promises = [
  { num: "30", title: "30-Day Promise", body: "If the first 30 days don’t feel right, we refund your instalment." },
  {
    num: "+30",
    title: "Goal Promise",
    body: "We set your goal together on Day 10. If we don’t reach it by Day 100, we keep building with you for 30 more days, free.",
  },
];

const check = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="mt-[0.3rem] size-4 shrink-0">
    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 md:py-28">
      <Container as="div">
        <SectionHeading lead="One price.">
          One fee for the whole studio, growth, tech, AI and legal, for 100 days. The scope moves when your business needs it to. The number doesn’t.
        </SectionHeading>

        <div className="kn-price-grid mt-12 grid items-start gap-x-1.5 gap-y-12 lg:mt-20 lg:grid-cols-[1.06fr_0.94fr] lg:gap-x-12">
          {/* The fee, explained: what we promise about it and when it is paid. */}
          <div>
            <ul className="flex flex-wrap gap-1.5">
              {["Application-only", `${pricing.seats} seats per cohort`, "Cohort 01 starts November"].map((chip) => (
                <li key={chip} className="mono-text text-dark/70 rounded-full bg-gray-200 px-3.5 py-2 font-mono">
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <ul className="grid border-t border-dark/10 sm:grid-cols-2">
                {pricingFacts.map(([title, body], i) => (
                  <li
                    key={title}
                    className={`border-b border-dark/10 py-6 ${i % 2 === 0 ? "sm:border-r sm:pr-7" : "sm:pl-7"}`}
                  >
                    <p className="font-medium">{title}</p>
                    <p className="text-dark-subtle mt-1.5 max-w-[34ch] text-xs leading-tight">{body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 md:mt-16">
              <p id="pay-schedule" className="mono-text text-dark/80 font-mono">
                How you pay it
              </p>
              <ol aria-labelledby="pay-schedule" className="border-dark mt-6 border-t">
                {paymentSteps.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-dark/10 py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5"
                  >
                    <span className="mono-text border-dark mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border font-mono tabular-nums">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-dark-subtle mt-1.5 max-w-[46ch] text-xs leading-tight">{step.body}</p>
                    </div>
                    <p className="col-start-2 sm:col-start-3 sm:text-right">
                      <span className="block text-xl leading-none font-medium">{step.amount}</span>
                    </p>
                  </li>
                ))}
              </ol>
              <p className="text-dark-subtle mt-5 max-w-[56ch] text-xs leading-tight">
                Total <span className="text-dark font-medium">{pricing.total}</span>. Every rupee is scheduled before you start: no
                milestone invoices, no change orders, no surprise line at Day 70.
              </p>

              {/* The market rate, highlighted, against the founding price. */}
              <div className="kn-compare" role="group" aria-label="Market rate compared with the founding price">
                <div className="kn-compare-a">
                  <p className="mono-text font-mono">At market/industry standard rates, the build is worth</p>
                  <p className="kn-compare-num">₹5.9 lakh</p>
                </div>
                <span className="kn-compare-vs" aria-hidden="true">
                  →
                </span>
                <div className="kn-compare-b">
                  <p className="mono-text font-mono">Founding price for Cohort 01</p>
                  <p className="kn-compare-num">
                    {pricing.fee} <span>{pricing.gst}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The card: the number first, what it covers and the way in; the two promises under it. */}
          <div className="kn-fee-col">
            <aside className="kn-fee bg-panel rounded-xl p-6 md:p-10">
              <h3 className="text-xl font-medium lg:text-2xl">What the fee covers</h3>
              <p className="mono-text mt-2 font-mono text-dark/70">
                {pricing.cohort} · {pricing.seats} seats, selection is rolling
              </p>

              <div className="kn-fee-price">
                <p className="mono-text font-mono text-dark/70">Program fee</p>
                <p className="mt-2.5 flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl leading-none font-medium">{pricing.fee}</span>
                  <span className="mono-text font-mono text-dark/70">{pricing.gst}</span>
                </p>
                <p className="kn-fee-sch">
                  Scholarships: one full scholarship, and 20–30% off on four tracks. <a href="#scholarships">See scholarships ↓</a>
                </p>
              </div>

              <ul className="mt-7 space-y-3 text-sm leading-tight">
                {feeIncludes.map(([thing, rest]) => (
                  <li key={thing} className="flex gap-3">
                    {check}
                    <span className="text-dark/80">
                      <span className="text-dark font-medium">{thing}</span>
                      {rest}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="kn-fee-cta mt-7">
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
              <p className="mt-4 text-xs leading-tight text-dark/70">{pricing.fine}</p>
            </aside>

            <div className="kn-promises kn-promises-side">
              <h3 className="kn-promises-title">Two promises.</h3>
              <ul className="kn-promise-list">
                {promises.map((p) => (
                  <li key={p.title} className="kn-promise">
                    <span className="kn-promise-num mono-text font-mono">{p.num}</span>
                    <p className="kn-promise-t">{p.title}</p>
                    <p className="kn-promise-d">{p.body}</p>
                  </li>
                ))}
              </ul>
              <p className="kn-promises-note">
                Both promises apply when you attend the weekly classes and do your roadmap tasks. Full terms are in the founder
                agreement.
              </p>
            </div>
          </div>
        </div>

        {/* The ledger: in and out, on the same page as the price. */}
        <div className="mt-16 lg:mt-28">
          <h3 className="text-3xl font-medium md:text-4xl">One price. Clarity both ways.</h3>
          <div className="mt-8 grid gap-1.5 lg:mt-12 lg:grid-cols-[1.5fr_1fr]">
            <section className="kn-inc border-dark/20 rounded-xl border bg-gray-100 p-6 md:p-10">
              <h4 className="flex flex-wrap items-baseline gap-3 text-xl font-medium lg:text-2xl">
                Included <span className="mono-text text-dark-very-subtle font-mono">in the 100</span>
              </h4>
              <p className="text-dark-subtle mt-2 text-xs leading-tight">Everything the roadmap needs to hit the goal.</p>
              <ul className="mt-6 sm:columns-2 sm:gap-x-7">
                {ledgerIn.map((item) => (
                  <li key={item} className="flex gap-2.5 border-t border-dark/10 py-3 text-sm leading-tight break-inside-avoid">
                    <span aria-hidden="true" className="bg-dark mt-[0.4rem] size-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="kn-notinc rounded-xl border p-6 md:p-10">
              <h4 className="flex flex-wrap items-baseline gap-3 text-xl font-medium lg:text-2xl">
                Not included <span className="mono-text text-dark-very-subtle font-mono">your call</span>
              </h4>
              <p className="text-dark-subtle mt-2 text-xs leading-tight">Kept out, so you stay in control.</p>
              <ul className="mt-6">
                {ledgerOut.map(([item, why]) => (
                  <li key={item} className="border-t border-dark/10 py-3 text-sm leading-tight">
                    <span className="flex gap-2.5">
                      <span aria-hidden="true" className="text-dark-very-subtle mt-px shrink-0 font-mono text-xs">
                        ✕
                      </span>
                      {item}
                    </span>
                    <span className="mono-text text-dark-very-subtle mt-1.5 block pl-6 font-mono normal-case">{why}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
