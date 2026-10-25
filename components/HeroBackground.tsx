import Image from "next/image";
import HeroVideo from "./HeroVideo";

/**
 * Hero backdrop: the studio film, a 20-second walk through the knnekt studio with
 * the wordmark and the claim set into the frame itself, over a still of its own
 * first frame, with the site's film-grain overlay above both.
 *
 * The still is the LCP element and the only thing the first paint waits for:
 * a 58 KB WebP served through next/image and preloaded. <HeroVideo/> fades in
 * over it once it is playing, and since it opens on that exact frame the hand-off
 * doesn't show.
 *
 * Both share `.hero-frame`, which is `cover` on anything landscape or near it.
 * On a tall phone screen `cover` would crop the 16:9 frame down to its middle
 * quarter and cut the type set in it, so below a 4:5 aspect the frame is sized to
 * keep the type whole instead and feathered top and bottom into a backdrop split
 * the same way (the film's own navy above, the page's white below). The rules
 * are in globals.css.
 *
 * The picture fades up with a slight push-in, once, on load, behind
 * `motion-safe`. It sits on the wrapper so the film inherits the same transform
 * and the two never disagree mid-reveal. There is no Ken Burns drift on this one:
 * rescaling a playing 1080p layer every frame is real compositor work, and the
 * film already moves.
 *
 * Dissolving the foot of the frame into the white page belongs to <HeroFog/>, which
 * paints above this one.
 */
export default function HeroBackground() {
  return (
    <div className="hero-backdrop after:animate-grain after:bg-grain absolute inset-0 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]">
      <div className="motion-safe:animate-hero-reveal relative size-full">
        <Image
          src="/images/hero--video-poster.webp"
          alt=""
          width={1920}
          height={1080}
          preload
          sizes="(max-aspect-ratio: 4/5) 220vw, 100vw"
          className="hero-frame"
        />
        <HeroVideo />
      </div>
    </div>
  );
}
