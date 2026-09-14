import Image from "next/image";

/**
 * Hero backdrop: a full-bleed still — two figures meeting, lit, on an open dark plain —
 * under the site's film-grain overlay.
 *
 * The source frame is portrait, and cropping a portrait into a landscape hero costs
 * a 1.4× zoom, which is enough to march the figures up close and lose the distance
 * the picture is about. So the asset is widened instead of cropped: the frame sits at
 * its native proportion in the middle of a 16:9 canvas, and the empty plain is carried
 * out to either side from the outermost column of the original. The image varies by
 * four levels out of 255 across its whole width, so an extension drawn that way holds
 * the horizon edge to edge with nothing to see at the joins — and the figures keep the
 * size they have in the original, small against a lot of nothing.
 *
 * Because the canvas now matches the shape of the viewport, `cover` barely scales at
 * all and plain `object-center` is the whole framing rule: the horizon lands around
 * two thirds down, the figures just under it, and the top half stays clear sky for
 * the wordmark and the claim to sit straight on.
 *
 * Two motions, both slow enough to read as atmosphere rather than animation, and both
 * behind `motion-safe` so a reduced-motion visitor gets the still frame:
 *   1. the picture fades up with a slight push-in, once, on load;
 *   2. a Ken Burns drift on a separate wrapper, so it composes with the reveal's
 *      transform instead of fighting it for the same property.
 * The grain stays on this outer element so it never rides along with the drift, and
 * the foot of the frame dissolves into the white page below it.
 */
export default function HeroBackground() {
  return (
    <div className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-gray-200 after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]">
      <div className="motion-safe:animate-hero-drift relative size-full">
        <Image
          src="/images/hero--plain.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="motion-safe:animate-hero-reveal object-cover object-center"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
