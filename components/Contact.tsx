import { founderPortrait } from "@/lib/data";
import Container from "./Container";
import ContactForm, { CONTACT_EMAIL } from "./ContactForm";
import GradientBackground from "./GradientBackground";

const details: [string, string][] = [
  ["Studio", "Delhi NCR, India"],
  ["Next cohort", "Fifteen seats, one quarter"],
  ["Reply time", "Two working days"],
];

/**
 * The enquiry band. The claim, the person who reads it and how to reach them sit
 * on the left; the form sits on the right in a white card so the fields keep the
 * page's normal dark-on-white contrast instead of fighting the gradient.
 */
export default function Contact() {
  return (
    <Container id="contact" className="pt-14 pb-24 md:py-20">
      <div className="bg-darker relative isolate overflow-hidden rounded-xl text-white">
        <GradientBackground />
        <div className="relative z-10 grid gap-x-1.5 gap-y-12 px-4 py-8 sm:p-8 lg:grid-cols-12 lg:gap-y-0 lg:p-12">
          <div className="flex flex-col justify-between lg:col-span-5 lg:pr-10">
            <div>
              <h2 className="font-medium text-2xl md:text-3xl">
                <span className="block text-white/50">Take the score. Then the truth.</span>
                <span className="mt-1 block">Let’s talk about your next 90 days.</span>
              </h2>
              <dl className="mt-10 grid gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-5">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="mono-text font-mono text-white/50">{label}</dt>
                    <dd className="mt-1.5 text-sm leading-tight">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="text-dark mt-12 rounded-xl bg-white p-4 sm:flex sm:justify-between md:p-2 lg:mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Portrait of a Knnekt studio partner"
                loading="lazy"
                decoding="async"
                width={500}
                height={500}
                className="size-20 rounded-lg sm:order-2 md:size-[8.5rem]"
                sizes="(min-width: 768px) 8.5rem, 5rem"
                src={founderPortrait}
              />
              <div className="mt-7 flex flex-col items-start justify-between sm:mt-0 sm:p-3">
                <p>
                  <span className="block">Knnekt Studios</span>
                  <span className="text-dark-very-subtle -mt-0.5 block text-sm">Startup Operating Partner · Delhi NCR</span>
                </p>
                <p className="mt-6">
                  <a
                    className="mono-text group flex items-center gap-5 rounded-full pr-4 font-mono outline-offset-2 outline-dark"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    <span className="rounded-full bg-dark px-7 py-3 text-white transition-colors group-hover:bg-dark/80 group-focus-visible:bg-dark/80 lg:px-5">
                      Or just email us
                    </span>
                    <span className="text-dark/50 group-hover:text-dark group-focus-visible:text-dark transition-colors">{CONTACT_EMAIL}</span>
                  </a>
                </p>
              </div>
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
