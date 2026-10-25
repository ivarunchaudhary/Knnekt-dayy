import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { HERO_LANDSCAPE, HERO_PORTRAIT } from "@/lib/hero";
import HeroVideo from "./HeroVideo";

/**
 * Hero backdrop: the studio film, a 20-second walk through the knnekt studio with
 * the wordmark and the claim set into the frame itself, over a still of its own
 * first frame, with the site's film-grain overlay above both.
 *
 * The film comes in two cuts, art-directed rather than cropped by CSS. Landscape
 * and near-square screens get the 16:9 master. Below a 4:5 aspect (every phone
 * held upright, tablets in portrait), `cover` on 16:9 would keep only the middle
 * quarter of the frame and cut the claim in half, so those screens get a 9:16
 * cut made for them: the middle 1080×1080 of the master at native resolution,
 * which holds the type with room to spare even on a 20:9 phone, its sky
 * stretched up into a deep navy above and its foot dissolved into the white of
 * the page. It is a plain `cover` video with no mask and no oversized layer, so
 * a phone composites one screen-sized rectangle.
 *
 * The still is the LCP element and the only thing the first paint waits for. It
 * follows the same art direction as a <picture>, and each orientation preloads
 * only its own poster (the `media` on the preload), so a phone never fetches
 * the landscape one. <HeroVideo/> plays over it once the page has loaded, and
 * since each cut opens on its poster's exact frame the hand-off doesn't show.
 *
 * The picture fades up with a slight push-in, once, on load, behind
 * `motion-safe`. It sits on the wrapper so the film inherits the same transform
 * and the two never disagree mid-reveal.
 *
 * Dissolving the foot of the frame into the white page belongs to <HeroFog/>, which
 * paints above this one.
 */
export default function HeroBackground() {
  const {
    props: { src: landscapeSrc, srcSet: landscape, sizes: landscapeSizes },
  } = getImageProps({
    alt: "",
    src: "/images/hero--video-poster.webp",
    width: 1920,
    height: 1080,
    // Plain `vw` on purpose, here and below: the preload scanner and the <picture>
    // have to resolve `sizes` to the same candidate, and with `vh` or `max()` in
    // it they didn't, so the phone poster was fetched twice at two widths.
    sizes: "100vw",
  });
  const {
    props: { srcSet: portrait, sizes: portraitSizes, ...img },
  } = getImageProps({
    alt: "",
    src: "/images/hero--video-poster-9x16.webp",
    width: 1080,
    height: 1920,
    // `cover` on a 19.5:9 phone draws the 9:16 frame ~122% of the screen's width.
    sizes: "122vw",
    loading: "eager",
    fetchPriority: "high",
  });

  preload(img.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: portrait,
    imageSizes: portraitSizes,
    media: HERO_PORTRAIT,
  });
  preload(landscapeSrc, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: landscape,
    imageSizes: landscapeSizes,
    media: HERO_LANDSCAPE,
  });

  return (
    <div className="hero-backdrop after:animate-grain after:bg-grain absolute inset-0 overflow-hidden after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]">
      <div className="motion-safe:animate-hero-reveal relative size-full">
        <picture>
          <source media={HERO_PORTRAIT} srcSet={portrait} sizes={portraitSizes} />
          <source media={HERO_LANDSCAPE} srcSet={landscape} sizes={landscapeSizes} />
          <img {...img} alt="" className="hero-frame" />
        </picture>
        <HeroVideo />
      </div>
    </div>
  );
}
