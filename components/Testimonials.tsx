import { testimonials } from "@/lib/data";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { containerClass, SectionHeading } from "./Container";

/**
 * Founder quotes one at a time, each on a photo that shuffles to the front of a
 * stack. The sector is the heading, with the stage and the number the quote
 * earned beneath it. Autoplay holds on hover and focus, and stays off under
 * `prefers-reduced-motion`.
 */
export default function Testimonials() {
  const items = testimonials.map((t) => {
    // "Founder · Athleisure · In market" → heading "Athleisure", "Founder · In market" beneath.
    const [role, sector, stage] = t.attribution.split(" · ");
    return {
      quote: t.quote,
      name: sector,
      designation: [role, stage, t.result].filter(Boolean).join(" · "),
      src: t.image.src,
      alt: t.image.alt,
    };
  });

  return (
    <section id="testimonials" className="overflow-hidden py-12 md:py-28">
      <div className={containerClass}>
        <SectionHeading lead="What founders say after the ninety days.">
          Attributed by stage and sector until founders consent to be named, each one sitting next to the number it earned.
        </SectionHeading>
      </div>

      <div className={containerClass}>
        <AnimatedTestimonials
          testimonials={items}
          autoplay
          className="mx-0 mt-12 max-w-none px-0 py-0 md:mt-20 md:max-w-5xl md:px-0 lg:px-0"
        />
      </div>
    </section>
  );
}
