import { proofPoints } from "@/lib/data";
import { containerClass } from "./Container";

const fadeRight =
  "relative z-10 flex w-full before:w-full before:bg-white after:w-full after:max-w-32 after:bg-[linear-gradient(to_right,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_20%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.4)_60%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0)_100%)]";
const fadeLeft =
  "relative z-10 flex w-full before:w-full before:max-w-32 before:bg-[linear-gradient(to_left,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_20%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.4)_60%,rgba(255,255,255,0.2)_80%,rgba(255,255,255,0)_100%)] after:w-full after:bg-white";

function PointRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-1.5 pr-1.5" aria-hidden={hidden}>
      {proofPoints.map((point) => (
        <li key={point} className="bg-dark/5 flex h-40 w-64 shrink-0 items-center justify-center rounded-xl px-8">
          <span className="text-center text-lg leading-tight font-medium text-balance">{point}</span>
        </li>
      ))}
    </ul>
  );
}

/** Intro claim + infinitely scrolling marquee of the studio's facts, faded out on both edges. */
export default function Intro() {
  return (
    <div className="isolate flex overflow-hidden pt-10 pb-15 md:py-20">
      <div className={fadeRight} />
      <section className={`${containerClass} shrink-0`}>
        <h1 className="text-dark-subtle font-medium text-2xl lg:text-3xl max-w-[52.25rem]">
          <span className="text-dark transition-colors duration-500">Your first 100 customers. Fund-ready in 90 days.</span> It starts with your Startup Operating Score. Then fifteen founders per cohort go all-in for one 90-day build—and come out with real customers and a company ready to raise.
        </h1>
        <div className="mt-7 md:mt-20">
          <div className="marquee flex">
            <PointRow />
            <PointRow hidden />
            <PointRow hidden />
          </div>
        </div>
      </section>
      <div className={fadeLeft} />
    </div>
  );
}
