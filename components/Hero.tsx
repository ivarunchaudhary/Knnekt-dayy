import { containerClass } from "./Container";
import HeroFilm from "./HeroFilm";
import HeroFog from "./HeroFog";
import Wordmark from "./Wordmark";

/**
 * The hero: the wordmark and the claim set over the studio film (see
 * <HeroFilm/>), which no longer carries any type of its own. A soft shadow
 * under the claim keeps it readable over the film's brightest scenes (see
 * `header[data-hero]` in globals.css).
 *
 * The shell stays `bg-sky-soft`, which is what shows before the poster decodes.
 */
export default function Hero() {
  return (
    <header data-hero className="relative h-svh bg-sky-soft">
      <div className={`${containerClass} relative z-20 flex h-full flex-col items-center pt-[19vh] text-center text-white`}>
        <Wordmark className="text-[clamp(2.25rem,13vw,7.5rem)] leading-none text-sky-soft" />
        <p className="mt-5 text-[1.75rem] leading-tight sm:text-[2.5rem]">India&rsquo;s First Startup Execution Studio · Gurugram</p>
      </div>
      <HeroFilm />
      <HeroFog />
    </header>
  );
}
