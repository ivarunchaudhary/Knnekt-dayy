import Container from "./Container";
import ContactForm from "./ContactForm";
import GradientBackground from "./GradientBackground";
import ScoreButton from "./ScoreButton";

const details: [string, string][] = [
  ["Studio", "Gurugram, India"],
  ["Next cohort", "Cohort 01, 15 seats, starts November"],
  ["Response", "We call you within 24 hours"],
];

/**
 * The enquiry band. The claim, the score CTA and the cohort details sit on the
 * left; the form sits on the right in a white card, which is now a step
 * up out of the band rather than a rescue from it — the ground went light with
 * the rest of the page, so the band carries the ink at 8.4:1 at its deepest stop
 * and the card reads as the near surface instead of as the only legible one.
 */
export default function Contact() {
  return (
    <Container id="contact" className="pt-14 pb-24 md:py-20">
      <div className="bg-panel relative isolate overflow-hidden rounded-xl">
        <GradientBackground />
        <div className="relative z-10 grid gap-x-1.5 gap-y-12 px-4 py-8 sm:p-8 lg:grid-cols-12 lg:gap-y-0 lg:p-12">
          <div className="flex flex-col justify-between lg:col-span-5 lg:pr-10">
            {/* Heading, paragraph and button share one width, so the CTA runs the full measure of the copy above it (see `.kn-cta`). */}
            <div className="kn-cta">
              <h2 className="font-medium text-2xl md:text-3xl">Take the score NOW.</h2>
              <p className="mt-4 max-w-[30ch] text-lg text-dark/80 lg:text-xl">
                We’re taking 15 founders this cohort, in November. Fill in the form, and we’ll call you within 24 hours with your
                constraints and next moves.
              </p>
              <p className="mt-8">
                <ScoreButton className="mono-text group inline-flex w-full items-center justify-center gap-3 rounded-full bg-sky-deep py-2 pr-2 pl-6 text-xs text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(22_37_63/0.55)] outline-offset-2 outline-dark transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-dark hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_24px_-10px_rgb(22_37_63/0.6)] focus-visible:bg-dark active:translate-y-0 active:scale-[0.98] sm:w-auto sm:pl-7 sm:text-sm sm:whitespace-nowrap">
                  Take the free Startup Operating Score
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm text-sky-deep transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-dark sm:size-10"
                  >
                    →
                  </span>
                </ScoreButton>
              </p>
              <dl className="mt-10 grid gap-x-6 gap-y-6 border-t border-dark/15 pt-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-5">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="mono-text font-mono text-dark/75">{label}</dt>
                    <dd className="mt-1.5 text-sm leading-tight">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-6 xl:col-start-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
