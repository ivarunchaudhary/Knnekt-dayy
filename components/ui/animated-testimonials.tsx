"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AnimatedTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  /** Describes the photo; falls back to `name`. */
  alt?: string;
};

/**
 * A fixed tilt per card, between -10° and 10°. The original drew these from
 * `Math.random()` during render, which puts a different transform in the server
 * HTML than the client hydrates with.
 */
const tilt = (index: number) => ((index * 7 + 3) % 21) - 10;

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: AnimatedTestimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  // Autoplay holds while the pointer or keyboard focus is inside, and never
  // runs under reduced motion.
  const playing = autoplay && !paused && !reduceMotion;
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [playing, handleNext]);

  const current = testimonials[active];

  return (
    <div
      className={cn("mx-auto max-w-sm px-4 py-20 md:max-w-4xl md:px-8 lg:px-12", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: tilt(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : tilt(index),
                    zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                    y: isActive(index) && !reduceMotion ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: tilt(index),
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                  aria-hidden={!isActive(index)}
                >
                  <Image
                    src={testimonial.src}
                    alt={isActive(index) ? (testimonial.alt ?? testimonial.name) : ""}
                    width={500}
                    height={500}
                    sizes="(min-width: 768px) 28rem, 90vw"
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            aria-live={playing ? "off" : "polite"}
            initial={{
              y: reduceMotion ? 0 : 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-dark text-2xl font-medium">{current.name}</h3>
            <p className="text-dark-subtle mt-1 text-sm">{current.designation}</p>
            <blockquote className="text-dark-subtle mt-8 text-lg">
              {current.quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }
                  }
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </blockquote>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group/button focus-visible:outline-dark flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <IconArrowLeft
                aria-hidden="true"
                className="text-dark h-5 w-5 transition-transform duration-300 group-hover/button:rotate-12"
              />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group/button focus-visible:outline-dark flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <IconArrowRight
                aria-hidden="true"
                className="text-dark h-5 w-5 transition-transform duration-300 group-hover/button:-rotate-12"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
