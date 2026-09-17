/**
 * The dark ground behind the contact card: the hero's sky, drawn rather than
 * photographed. The stops are the brand blue at three depths — nearly black at the
 * top of the frame, opening towards #2871B2 itself at the foot — so the card reads
 * as one more window onto the same sky rather than as a black slab dropped between
 * two blue ones. The site's film grain sits over it, as it does over the
 * photographs, which is most of what sells the match.
 *
 * The foot is the lightest the ramp can get: it carries no small type (the white
 * contact card and the form sit over it), while the 48% stop does carry the
 * `text-white/50` labels, and that blend holds 4.7:1 there.
 *
 * It was a video, which cost half a megabyte and a breakpoint's worth of client state
 * to deliver what is, on inspection, a three-stop gradient. Drawn in CSS it weighs
 * nothing, paints with the first frame, and lets this stay a server component.
 */
export default function GradientBackground() {
  return (
    <div className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-[linear-gradient(to_top,#1c4f7d_0%,#102d47_48%,#091a2a_100%)] after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-5" />
  );
}
