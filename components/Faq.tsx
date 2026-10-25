import Container, { SectionHeading } from "./Container";

/** [key, question, answer]. The key is what faq_open reports to analytics. */
const faqs: [string, string, string][] = [
  [
    "equity",
    "Do you take equity?",
    "Not today. You pay one fixed fee, ₹3,00,000 + GST. Long term, for a small number of founders, that’s where this goes. It’s earned, not sold.",
  ],
  [
    "who_for",
    "Who is this for?",
    "Founders with an idea or an early product who want to build it properly and be ready for investors in 100 days. Take the free Score to see where you stand; a low score doesn’t rule you out.",
  ],
  ["in_person", "Is it in person?", "Yes. You build from our studio in Gurugram on weekdays, beside the cohort and the studio team."],
  ["cofounder", "Can my co-founder join?", "Yes. The seat is for your startup, so your co-founders build alongside you."],
  [
    "pay",
    "How do I pay?",
    "₹15,000 + GST holds your seat and counts against the fee. Then three payments of ₹95,000 + GST on Day 0, Day 31 and Day 45. Nothing after that.",
  ],
  [
    "scholarships",
    "Do you offer scholarships?",
    "Yes. One full scholarship every cohort, and 20–30% off the fee for women founders, founders from tier-2 cities, second-time founders and on need. Tick “Consider me for a scholarship” in the application.",
  ],
  [
    "not_working",
    "What if it isn’t working?",
    "If the first 30 days don’t feel right, we refund your instalment. If we miss the goal we set on Day 10, we keep building with you for 30 more days, free.",
  ],
  ["pivot", "What if we pivot?", "We move scope, not price. If the plan changes, we rebuild it with you at the same fee."],
  [
    "grants",
    "Do you help with government grants?",
    "Yes. We pick founders we believe can be funded by investors and through government schemes for startups, and we help you prepare for them.",
  ],
];

/**
 * The questions founders ask before they apply, as a short accordion. The
 * items share a `name`, so opening one closes the others; the heading stays
 * pinned beside the list on desktop.
 */
export default function Faq() {
  return (
    <section id="faq" className="py-12 md:py-28">
      <Container as="div">
        <div className="kf-grid">
          <SectionHeading lead="Questions founders ask.">
            Still unsure?{" "}
            <a className="kf-link" href="#contact">
              Ask us directly
            </a>
            .
          </SectionHeading>
          <div className="kf-list">
            {faqs.map(([key, q, a], i) => (
              <details key={key} className="kf-item" name="kn-faq" open={i === 0} data-faq={key}>
                <summary className="kf-q">
                  <span>{q}</span>
                  <span className="kf-icon" aria-hidden="true" />
                </summary>
                <div className="kf-a">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
