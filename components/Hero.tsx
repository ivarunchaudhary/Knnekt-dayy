import HeroBackground from "./HeroBackground";
import HeroFog from "./HeroFog";
import Wordmark from "./Wordmark";

/**
 * The hero is the studio film (see <HeroBackground/>), and the film carries the
 * wordmark and the claim in its own frame, so the type here is for screen
 * readers and crawlers only. Drawn on screen as well, it would sit on top of its
 * own twin. For the same reason there is no scrim any more: the film's top band
 * is already a deep navy under its white type.
 *
 * The shell stays `bg-sky-soft` (see `.hero-backdrop`), which is what shows for
 * the frame before the poster decodes.
 */
export default function Hero() {
  return (
    <header className="relative h-svh bg-sky-soft">
      <div className="sr-only">
        <Wordmark />
        <p>India&rsquo;s first startup execution studio · Gurugram</p>
      </div>
      <HeroBackground />
      <HeroFog />
    </header>
  );
}
