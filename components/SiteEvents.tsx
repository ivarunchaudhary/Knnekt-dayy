"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/pixel";

const contactMethod = (href: string) =>
  href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : /wa\.me|whatsapp\.com/.test(href) ? "whatsapp" : null;

/**
 * The website's own events, listened for once at the document instead of
 * wired into every component:
 *
 * - score_cta_click / ScoreClick on any "Take the score" button
 *   (`data-score-cta`), with the section it sits in as `location` unless the
 *   button names one itself.
 * - contact_click / Contact on WhatsApp, phone and email links, with `method`.
 *   Inside the score's report (`[data-report]`) the same taps count as
 *   report_cta_click, with `cta`: whatsapp or call go to Meta as Contact too.
 *   A report link can name its own `data-report-cta`.
 * - faq_open when a question is opened (`data-faq` on its <details>). Taken
 *   from the click on its summary rather than the `toggle` event, which also
 *   fires for the question that starts open.
 * - pricing_view / ViewContent the first time pricing scrolls into view on a
 *   page.
 */
export default function SiteEvents() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const cta = target?.closest<HTMLElement>("[data-score-cta]");
      if (cta) {
        const location = cta.dataset.scoreCta || cta.closest("section[id]")?.id || "page";
        track("score_cta_click", { location }, { event: "ScoreClick" });
        return;
      }
      const question = target?.closest("summary")?.parentElement;
      if (question instanceof HTMLDetailsElement && question.dataset.faq && !question.open) {
        track("faq_open", { question: question.dataset.faq });
        return;
      }
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const method = contactMethod(link.getAttribute("href") ?? "");
      if (link.closest("[data-report]")) {
        const cta = link.dataset.reportCta || (method === "phone" ? "call" : method);
        if (!cta) return;
        const contact = cta === "whatsapp" || cta === "call";
        track("report_cta_click", { cta }, contact ? { event: "Contact", params: { method: cta } } : undefined);
      } else if (method) track("contact_click", { method }, { event: "Contact" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const pricing = document.getElementById("pricing");
    if (!pricing) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        track("pricing_view", {}, { event: "ViewContent", params: { content_name: "Pricing" } });
      },
      { threshold: 0.25 },
    );
    io.observe(pricing);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
