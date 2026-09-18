import Image from "next/image";

/**
 * Hero backdrop: a full-bleed still — a studio crew at work on a white marble
 * set, under an open azure sky — with the site's film-grain overlay above it.
 *
 * The frame is already the shape of a hero: a 1594x986 landscape, roughly 16:10,
 * with every figure held along the bottom third and the whole upper half given
 * over to empty sky. So `cover` barely scales at all and `object-bottom` is the
 * whole framing rule — pinning the foot keeps the crew in shot at every viewport
 * height, and the sky above them is what absorbs the crop on a tall screen. That
 * empty sky is also the reason the wordmark and the claim can sit where they do:
 * they land on flat colour rather than on anybody's head.
 *
 * The picture is light, which is the point of it, but that means the top band is
 * mid-luminance azure (#3B81E3) rather than something white type sits on
 * comfortably — white holds only 3.9:1 there. <Hero/> lays a navy scrim over the
 * top 60% for that, which brings the claim's blend to about 5:1 while leaving the
 * lower two-thirds of the photograph untouched.
 *
 * Two motions, both slow enough to read as atmosphere rather than animation, and
 * both behind `motion-safe` so a reduced-motion visitor gets the still frame:
 *   1. the picture fades up with a slight push-in, once, on load;
 *   2. a Ken Burns drift on a separate wrapper, so it composes with the reveal's
 *      transform instead of fighting it for the same property.
 * The grain stays on this outer element so it never rides along with the drift.
 *
 * Dissolving the foot of the frame into the white page belongs to <HeroFog/>, which
 * paints above this one: a fade drawn here would sit under the fog and the hero would
 * meet <Intro/> on a hard line of colour halfway through the scroll.
 */
export default function HeroBackground() {
  return (
    <div className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-sky-soft after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]">
      <div className="motion-safe:animate-hero-drift relative size-full">
        <Image
          src="/images/hero--studio.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="motion-safe:animate-hero-reveal object-cover object-bottom"
        />
      </div>
    </div>
  );
}
