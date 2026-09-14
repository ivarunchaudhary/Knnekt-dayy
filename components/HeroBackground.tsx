import Image from "next/image";

/**
 * Hero backdrop: a full-bleed still — two sculpted hands reaching for each other,
 * not quite touching — under the site's film-grain overlay.
 *
 * The source frame is portrait, with the two hands stacked and the gesture running
 * top-right to bottom-left. Turned a quarter clockwise it becomes the horizontal
 * reach it always wanted to be: one hand entering from the left, one from the right,
 * the gap between the fingertips landing dead centre.
 *
 * Rotating leaves a 5:4 frame, and cropping that into a landscape hero would cost a
 * 1.4× zoom — enough to push the hands past the edges and lose the space the picture
 * is about. So the asset is widened rather than cropped: the rotated frame sits at its
 * native proportion in the middle of a 16:9 canvas, and the outermost column is carried
 * out to either side. The backdrop is a soft, near-flat gradient and the forearms are
 * already cut off by the frame, so the extension reads as the arms simply continuing
 * out of shot, with nothing to see at the joins.
 *
 * Because the canvas now matches the shape of the viewport, `cover` barely scales at
 * all and plain `object-center` is the whole framing rule: the hands sit across the
 * middle band, and the top of the frame stays clear for the wordmark and the claim.
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
          src="/images/hero--hands.webp"
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
