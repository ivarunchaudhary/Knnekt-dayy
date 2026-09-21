import { feeIncludes, ledgerIn, ledgerOut, paymentSteps, pricing, pricingFacts } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/**
 * One fee, and everything a founder needs to decide about it: the promises we
 * make about the number, the schedule it leaves their account on, and a card
 * that holds the figure, the seats left and the way in. The ledger underneath
 * closes it out — what the fee buys, and what deliberately stays on their card.
 */

const check = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="mt-[0.3rem] size-4 shrink-0">
    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Seats() {
  const taken = pricing.seats - pricing.seatsLeft;
  return (
    <div className="mt-7 border-t border-dark/15 pt-6">
      <div aria-hidden="true" className="grid grid-cols-15 gap-1">
        {Array.from({ length: pricing.seats }, (_, i) => (
          <span key={i} className={`h-6 rounded-sm ${i < taken ? "bg-dark" : "bg-dark/15"}`} />
        ))}
      </div>
      <p className="mt-3.5 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl leading-none font-medium tabular-nums">{pricing.seatsLeft}</span>
        <span className="mono-text font-mono text-dark/70">
          of {pricing.seats} seats left · {pricing.cohort}
        </span>
      </p>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="One price, published.">
          One fee for the whole studio, growth, tech, AI and legal, for one quarter. The scope moves when your business needs it to. The number doesn’t.
        </SectionHeading>

        <div className="mt-12 grid items-start gap-x-1.5 gap-y-12 lg:mt-20 lg:grid-cols-[1.06fr_0.94fr] lg:gap-x-12">
          {/* The fee, explained: what we promise about it and when it is paid. */}
          <div>
            <ul className="flex flex-wrap gap-1.5">
              {["Application-only", `${pricing.seats} seats per cohort`].map((chip) => (
                <li key={chip} className="mono-text text-dark/70 rounded-full bg-gray-200 px-3.5 py-2 font-mono">
                  {chip}
                </li>
              ))}
            </ul>

            <ul className="mt-10 grid border-t border-dark/10 sm:grid-cols-2">
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
                      <span className="mono-text text-dark-very-subtle mt-1.5 block font-mono">{step.when}</span>
                    </p>
                  </li>
                ))}
              </ol>
              <p className="text-dark-subtle mt-5 max-w-[56ch] text-xs leading-tight">
                Total <span className="text-dark font-medium">{pricing.total}</span>. Every rupee is scheduled before you start: no
                milestone invoices, no change orders, no surprise line at day 70.
              </p>
            </div>
          </div>

          {/* The card: the number itself, what it covers, and the way in. */}
          <aside className="bg-panel rounded-xl p-6 md:p-10 lg:sticky lg:top-24">
            <h3 className="text-xl font-medium lg:text-2xl">What the fee covers</h3>
            <p className="mono-text mt-2 font-mono text-dark/70">{pricing.cohort}</p>

            <ul className="mt-8 space-y-3 text-sm leading-tight">
              {feeIncludes.map(([thing, note]) => (
                <li key={thing} className="flex gap-3">
                  {check}
                  <span className="text-dark/80">
                    <span className="text-dark font-medium">{thing}</span>, {note}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 border-t border-dark/15 pt-6">
              <p className="mono-text font-mono text-dark/70">Program fee</p>
              <p className="mt-2.5 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl leading-none font-medium">{pricing.fee}</span>
                <span className="mono-text font-mono text-dark/70">{pricing.gst}</span>
              </p>
            </div>

            <Seats />

            <p className="mt-8 text-xs leading-tight text-dark/70">{pricing.fine}</p>
          </aside>
        </div>

        {/* The ledger: in and out, on the same page as the price. */}
        <div className="mt-16 lg:mt-28">
          <h3 className="text-3xl font-medium md:text-4xl">
            One price. <span className="text-dark-very-subtle">Clarity both ways.</span>
          </h3>
          <div className="mt-8 grid gap-1.5 lg:mt-12 lg:grid-cols-[1.5fr_1fr]">
            <section className="border-dark/20 rounded-xl border bg-gray-100 p-6 md:p-10">
              <h4 className="flex flex-wrap items-baseline gap-3 text-xl font-medium lg:text-2xl">
                Included <span className="mono-text text-dark-very-subtle font-mono">in the 90</span>
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
            <section className="rounded-xl border border-dark/10 bg-gray-200 p-6 md:p-10">
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
