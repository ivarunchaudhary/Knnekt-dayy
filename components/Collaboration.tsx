"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { principles } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import Parallax from "./Parallax";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    <path d="M4.07,10v-4.07H0v-1.89h4.07V0h1.89v4.04h4.04v1.89h-4.04v4.07h-1.89Z" />
  </svg>
);

export default function Collaboration() {
  return (
    <section id="about" className="overflow-hidden py-15 md:py-40">
      <Container>
        <SectionHeading lead="We’re not an agency. We’re an execution partner.">
          An agency takes your brief and bills the hours. We take a position on your business, build it with you, and own the outcome—same four functions under one roof, but on your side of the table.
        </SectionHeading>
        <Swiper
          modules={[FreeMode, Mousewheel]}
          slidesPerView="auto"
          spaceBetween={6}
          freeMode={{ momentumBounce: false }}
          mousewheel={{ forceToAxis: true }}
          grabCursor
          className="!overflow-visible overscroll-contain mt-10 lg:mt-16"
          breakpoints={{ 1280: { slidesPerView: 3, spaceBetween: 6 } }}
        >
          {principles.map((p, i) => (
            <SwiperSlide key={p.a} className="w-[23.25rem] max-w-[23.25rem] xl:w-auto xl:max-w-none">
              <button
                type="button"
                className="group flex aspect-[1/1.23] w-full cursor-[inherit] flex-col overflow-hidden rounded-lg border border-black/5 bg-gray-100 text-left outline-offset-2 outline-black transition-all duration-300 hover:rounded-2xl"
              >
                <span className="block w-full overflow-hidden">
                  <Parallax
                    className="ease-in-out-quart transition-transform duration-300 motion-safe:group-hover:scale-102 motion-safe:group-focus-visible:scale-102"
                    style={{ aspectRatio: "2000/1414" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={p.alt} loading="lazy" decoding="async" width={2000} height={1414} className="size-full object-cover" sizes="23.25rem" src={p.src} />
                  </Parallax>
                </span>
                <span className="flex w-full grow flex-col justify-between px-5 py-6">
                  <span className="font-medium [@media(min-width:1440px)]:text-lg">
                    <span className="text-dark-very-subtle group-hover:text-dark-subtle block transition-colors">{p.a}</span>
                    <span className="-mt-0.5 block [@media(min-width:1440px)]:mt-0.5">{p.b}</span>
                  </span>
                  <span className="flex cursor-pointer justify-between">
                    <span className="mono-text text-dark/50 group-hover:text-dark group-focus-visible:text-dark font-mono">0{i + 1}</span>
                    <PlusIcon />
                  </span>
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
