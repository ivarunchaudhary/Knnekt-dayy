import HeroBackground from "./HeroBackground";
import HeroFog from "./HeroFog";
import Wordmark from "./Wordmark";
import { containerClass } from "./Container";

/**
 * The hero is a light frame now, an azure sky over a white set, so the shell
 * behind it is `bg-sky-soft` rather than the old near-black plate: it is what
 * shows for the frame before the photograph decodes, and a dark flash under a
 * light picture is the one thing that reads as a fault.
 *
 * The claim stays white, because white is what belongs on sky; the wordmark is a
 * step larger and set in `sky-soft` (#B9D8F9), so the name reads as the one
 * coloured thing in the frame while the line under it stays plain white.
 * White on the picture's own top band (#3B81E3) holds only 3.9:1, though, so a
 * navy scrim runs down the top 60% of the frame, `--color-dark` at 55%, closing
 * to nothing, which brings the blend under the claim to about 5:1. It sits under
 * the content and over the picture, and stops well short of the crew, so the
 * lower two-thirds of the photograph are the photograph.
 */
export default function Hero() {
  return (
    <header className="relative h-svh bg-sky-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3/5 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-dark)_55%,transparent)_0%,transparent_100%)]"
      />
      <div className={`${containerClass} relative z-20 flex h-full flex-col items-center pt-[19vh] text-center text-white`}>
        <Wordmark className="text-4xl text-sky-soft sm:text-6xl" />
        <p className="mt-3 text-sm sm:text-xl">India&apos;s first Startup Execution Studio</p>
      </div>
      <HeroBackground />
      <HeroFog />
    </header>
  );
}
