"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { work, type WorkItem } from "@/lib/data";
import Container, { SectionHeading } from "./Container";
import Parallax from "./Parallax";
import Vimeo from "./Vimeo";

const hoverScale =
  "ease-in-out-quart size-full transition-transform duration-300 motion-safe:group-hover:scale-102 motion-safe:group-focus-visible:scale-102";

function Media({ item, variant, eager }: { item: WorkItem; variant: "mobile" | "desktop"; eager: boolean }) {
  if (item.vimeo) {
    return (
      <div className="overflow-hidden relative h-full bg-gray-200">
        <Vimeo id={item.vimeo} aspect={item.vimeoAspect} title={item.client} cover />
      </div>
    );
  }
  const img = item[variant]!;
  return (
    <Parallax className="size-full" style={{ aspectRatio: `${img.w}/${img.h}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={item.alt ?? item.client}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        width={img.w}
        height={img.h}
        className="size-full object-cover"
        sizes={variant === "mobile" ? "(min-width: 640px) 50vw, 100vw" : item.wide ? "(min-width: 1024px) 66vw, 50vw" : "(min-width: 1024px) 33vw, 50vw"}
        src={img.src}
      />
    </Parallax>
  );
}

function Card({ item, eager }: { item: WorkItem; eager: boolean }) {
  return (
    <Link
      href={`/en/case/${item.slug}`}
      className={`group block rounded-t-xl text-left outline-offset-2 outline-black ${item.wide ? "lg:col-span-2" : ""}`}
    >
      <span
        className={`pointer-events-none block aspect-[1/1.04] overflow-hidden rounded-xl transition-all duration-300 group-hover:rounded-2xl md:aspect-[1/1.3] ${
          item.wide ? "lg:aspect-auto lg:h-(--asset-height)" : ""
        }`}
      >
        <span className={`${hoverScale} md:hidden`}>
          <Media item={item} variant="mobile" eager={eager} />
        </span>
        <span className={`${hoverScale} hidden md:block`}>
          <Media item={item} variant="desktop" eager={eager} />
        </span>
      </span>
      <span className="mt-4 block">{item.client}</span>
      <span className="text-dark-subtle group-focus-visible:text-dark group-hover:text-dark block leading-tight transition-colors">{item.title}</span>
    </Link>
  );
}

export default function Work() {
  const grid = useRef<HTMLDivElement>(null);

  // Wide (2-column) cards match the height of a regular card's image: --asset-height
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const regular = el.querySelector<HTMLElement>("a:not(.lg\\:col-span-2) > span");
      if (regular) el.style.setProperty("--asset-height", `${regular.getBoundingClientRect().height}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Container id="work" className="pt-10 pb-20 md:py-48">
      <SectionHeading lead="Proof, not promises.">
        What we’ve built—and what we refused to build. Real builds, scored on the same six pillars before and after, each one naming what we told the founder not to buy.
      </SectionHeading>
      <div ref={grid} className="mt-14 space-y-10 gap-x-1.5 gap-y-10 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3 lg:gap-y-16">
        {work.map((item, i) => (
          <Card key={item.slug} item={item} eager={i < 3} />
        ))}
      </div>
    </Container>
  );
}
