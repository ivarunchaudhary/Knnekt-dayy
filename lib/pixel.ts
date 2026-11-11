import { useEffect, useMemo, useRef, type RefObject } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { allowed } from "./consent";
import { metaIds } from "./attribution";
import { PIXEL_ID, STANDARD_EVENTS, type MetaEvent, type RelayedEvent } from "./metaEvents";

export { PIXEL_ID };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, string | number>;
/** What the visitor has told us this visit; it rides along on every server event. */
let user: { email?: string; phone?: string; name?: string; city?: string; appId?: string } = {};
export const identify = (details: typeof user) => {
  user = { ...user, ...details };
};

/**
 * Only the live site reports to Meta. Localhost and Vercel previews used to
 * land in the same dataset as real visitors and skew every count; set
 * NEXT_PUBLIC_META_ANY_HOST=1 to test the pixel somewhere else on purpose.
 */
const liveHost = () => /(^|\.)knnekt\.studio$/.test(location.hostname) || process.env.NEXT_PUBLIC_META_ANY_HOST === "1";

/** Whether Meta may hear about this visit at all: the visitor allowed it, and this is the live site. */
export const metaAllowed = () => typeof window !== "undefined" && liveHost() && allowed("ads");

/**
 * Meta's base code, run once and only once advertising is allowed. Consent is
 * granted before init, so the pixel never runs a moment without it. Repeat
 * calls are no-ops: the snippet returns early once fbq exists.
 */
export function loadPixel() {
  if (window.fbq || !liveHost()) return;
  /* eslint-disable */
  // @ts-expect-error Meta's snippet, verbatim
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  // The snippet just defined fbq; TypeScript still has it narrowed to undefined from the guard above.
  const fbq = window.fbq as Window["fbq"];
  fbq?.("consent", "grant");
  fbq?.("init", PIXEL_ID);
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}.${Math.random().toString(36).slice(2)}`;

/** The pixel half of an event, on its own. For events whose server copy some other route sends. */
export function pixel(event: MetaEvent, params: Params, id: string) {
  if (!metaAllowed()) return;
  window.fbq?.(STANDARD_EVENTS.includes(event) ? "track" : "trackCustom", event, params, { eventID: id });
}

/**
 * One Meta event, sent twice under one ID: through the pixel in the browser
 * and through /api/meta to the Conversions API, so Meta keeps whichever
 * arrives and counts it once. keepalive lets the server copy finish even when
 * it's sent as the page is closing. Nothing goes until advertising is allowed.
 * `id` names the event where the event map gives it a fixed one (ld_<application_id>);
 * otherwise each call gets a fresh one with the event's prefix.
 */
export function meta(event: RelayedEvent, params?: Params, id?: string) {
  if (!metaAllowed()) return;
  const eventId = id ?? (event === "PageView" ? `pv_${uuid()}` : uuid());
  pixel(event, params ?? {}, eventId);
  fetch("/api/meta", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, id: eventId, url: location.href, params, user, ...metaIds() }),
  }).catch(() => {});
}

/**
 * Every tracked moment goes through here, so the names can't drift between
 * tools. GA4 gets the event with its parameters; Clarity gets it as a custom
 * event and each parameter as a tag recordings can be filtered by; Meta gets
 * its own name for it, when it has one. GA4 and Clarity apply the consent
 * mode themselves, Meta is held back by meta() above. Never pass anything
 * personal: the parameters reach GA4 and Clarity as they are.
 */
export function track(name: string, params: Params = {}, metaEvent?: { event: RelayedEvent; params?: Params; id?: string }) {
  if (GA_ID) sendGAEvent("event", name, params);
  if (window.clarity) {
    window.clarity("event", name);
    for (const [k, v] of Object.entries(params)) window.clarity("set", k, String(v));
  }
  if (metaEvent) meta(metaEvent.event, metaEvent.params ?? params, metaEvent.id);
}

/**
 * The forms GA4 follows step by step, and the names it knows them by. Others
 * (the contact form) report their funnel to Meta only.
 */
const FUNNELS: Record<string, { start: string; step: string; tag: string }> = {
  score: { start: "score_form_start", step: "score_form_step", tag: "score_step" },
};

/**
 * The funnel around one form: FormView when it comes into sight, FormStart on
 * the first answer, FormStep at each new page, and FormAbandon if the visitor
 * leaves after starting without submitting — closing the dialog, navigating
 * away or closing the tab. Every event carries `form`, so one set of names
 * covers every form on the site. The submit itself is a standard event the
 * caller sends, since that's the one ads optimise for. A form listed in
 * FUNNELS also reports its start and each new step to GA4, and tags Clarity
 * with the step the visitor is on. `start` takes extra parameters and a fixed
 * event ID, for the score's FormStart (content_name, fs_<application_id>).
 */
export function useFormTracking(form: string, ref: RefObject<HTMLElement | null>, firstStep = "form") {
  const funnel = FUNNELS[form];
  const state = useRef({ viewed: false, started: false, done: false, abandoned: false, step: 1, name: firstStep, furthest: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || state.current.viewed) return;
        state.current.viewed = true;
        meta("FormView", { form });
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [form, ref]);

  useEffect(() => {
    const abandon = () => {
      const s = state.current;
      if (!s.started || s.done || s.abandoned) return;
      s.abandoned = true;
      meta("FormAbandon", { form, step: s.step, step_name: s.name, furthest_step: s.furthest });
    };
    window.addEventListener("pagehide", abandon);
    // Unmounting mid-form is a drop too: the score dialog closing, or a client-side navigation.
    return () => {
      window.removeEventListener("pagehide", abandon);
      abandon();
    };
  }, [form]);

  return useMemo(
    () => ({
      start(extra?: { params?: Params; id?: string }) {
        const s = state.current;
        if (s.started) return;
        s.started = true;
        meta("FormStart", { form, ...extra?.params }, extra?.id);
        if (funnel) {
          track(funnel.start);
          window.clarity?.("set", funnel.tag, String(s.step));
        }
      },
      step(step: number, name: string) {
        const s = state.current;
        s.step = step;
        s.name = name;
        if (funnel) window.clarity?.("set", funnel.tag, String(step));
        if (step <= s.furthest) return; // going back isn't progress
        s.furthest = step;
        meta("FormStep", { form, step, step_name: name });
        if (funnel) track(funnel.step, { step, step_name: name });
      },
      submit() {
        state.current.done = true;
      },
      /** A fresh attempt at the same form, e.g. "Send another". */
      reset() {
        Object.assign(state.current, { started: false, done: false, abandoned: false, step: 1, name: firstStep, furthest: 1 });
      },
    }),
    [form, firstStep, funnel],
  );
}
