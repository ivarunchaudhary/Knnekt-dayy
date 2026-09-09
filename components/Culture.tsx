"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { culture } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import Parallax from "./Parallax";

export default function Culture() {
  return (
    <div className="overflow-hidden">
      <Container className="py-15 md:py-40">
        <SectionHeading id="people-title" lead="We focus on people, not just projects." className="whitespace-pre-line">
          {"\n"}In a world of digital meetings, we value face-to-face connections. Our culture is built on trust, freedom, and support, fostering personal growth and collaboration that goes beyond just completing tasks—it’s about enjoying the journey together.
        </SectionHeading>
        <div className="mt-16 md:mt-24" aria-labelledby="people-title">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={6}
            freeMode={{ momentumBounce: false }}
            mousewheel={{ forceToAxis: true }}
            grabCursor
            className="!overflow-visible"
          >
            {culture.map((c) => (
              <SwiperSlide key={c.title}>
                <figure className={`w-[80vw] max-w-[34.5rem] sm:w-[60vw] ${c.width}`}>
                  <Parallax axis="x" className="rounded-xl" style={{ aspectRatio: `${c.w}/${c.h}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={c.alt}
                      loading="lazy" decoding="async"
                      width={c.w}
                      height={c.h}
                      className="size-full object-cover"
                      sizes={`(min-width: 768px) ${c.sizes}, (min-width: 640px) 60vw, 100vw`}
                      src={c.src}
                    />
                  </Parallax>
                  <figcaption className="mt-4 text-sm leading-tight">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-dark-subtle mt-1">{c.text}</p>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
}
