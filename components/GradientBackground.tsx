/**
 * The ground behind the contact card: the hero's sky, drawn rather than
 * photographed. The stops are the studio blue at three heights of the same ramp
 * the photograph runs — #A8CEF4 at the top of the frame, opening down to
 * #D4E7FB at the foot — so the card reads as one more window onto that sky
 * rather than as a plate dropped between two pale sections. The site's film
 * grain sits over it, as it does over the photograph, which is most of what
 * sells the match.
 *
 * It used to run the other way, near-black at the head and opening to the brand
 * blue at the foot, and carried white type. Now that the page has no dark plate
 * left, the ramp is inverted and the band carries the ink: the deepest stop
 * holds `dark` at 8.4:1 and the `text-dark/75` labels at 4.8:1, which is what
 * fixes how far up the ramp the top stop can go. Push it past #A8CEF4 and the
 * labels fall under 4.5:1.
 *
 * It was a video, which cost half a megabyte and a breakpoint's worth of client state
 * to deliver what is, on inspection, a three-stop gradient. Drawn in CSS it weighs
 * nothing, paints with the first frame, and lets this stay a server component.
 */
export default function GradientBackground() {
  return (
    <div className="after:animate-grain after:bg-grain absolute inset-0 overflow-hidden bg-[linear-gradient(to_top,#d4e7fb_0%,#bfdcfa_48%,#a8cef4_100%)] after:absolute after:top-0 after:left-0 after:size-[140%] after:opacity-[0.04]" />
  );
}
