import { clientLogos } from "@/lib/data";
import { containerClass } from "./Container";

const fadeRight =
  "relative z-10 flex w-full before:w-full before:bg-white after:w-full after:max-w-32 after:bg-[linear-gradient(to_right,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_20%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.4)_60%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0)_100%)]";
const fadeLeft =
  "relative z-10 flex w-full before:w-full before:max-w-32 before:bg-[linear-gradient(to_left,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_20%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.4)_60%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0)_100%)] after:w-full after:bg-white";

function LogoRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-1.5 pr-1.5" aria-hidden={hidden}>
      {clientLogos.map((logo) => (
        <li key={logo.name} className="bg-dark/5 flex h-40 w-64 shrink-0 items-center justify-center rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={`${logo.name} Logo`} loading="lazy" width={logo.w} height={logo.h} className="h-2/5 w-3/5 object-contain" src={logo.src} />
        </li>
      ))}
    </ul>
  );
}

/** Intro claim + infinitely scrolling client-logo marquee, faded out on both edges. */
export default function Intro() {
  return (
    <div className="isolate flex overflow-hidden pt-10 pb-15 md:py-20">
      <div className={fadeRight} />
      <section className={`${containerClass} shrink-0`}>
        <h1 className="text-dark-subtle font-medium text-2xl lg:text-3xl max-w-[52.25rem]">
          <span className="text-dark transition-colors duration-500">Your 0 to 1 Partner for Digital Innovation.</span> Blending consultancy expertise with agency craft and creativity, we lead ambitious companies from insight to impact—fast.
        </h1>
        <div className="mt-7 md:mt-20">
          <div className="marquee flex">
            <LogoRow />
            <LogoRow hidden />
            <LogoRow hidden />
          </div>
        </div>
      </section>
      <div className={fadeLeft} />
    </div>
  );
}
