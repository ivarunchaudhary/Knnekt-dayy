import { useEffect, useMemo, useRef, type RefObject } from "react";
import { PIXEL_ID, type CustomEvent, type ServerEvent, type StandardEvent } from "./metaEvents";

export { PIXEL_ID };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, string | number>;
/** What the visitor has told us this visit; it rides along on every server event. */
let user: { email?: string; phone?: string; name?: string } = {};
export const identify = (details: typeof user) => {
  user = { ...user, ...details };
};

/** Meta's base code, run once. Repeat calls are no-ops: the snippet returns early once fbq exists. */
export function loadPixel() {
  if (window.fbq) return;
  /* eslint-disable */
  // @ts-expect-error Meta's snippet, verbatim
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  // The snippet just defined fbq; TypeScript still has it narrowed to undefined from the guard above.
  (window.fbq as Window["fbq"])?.("init", PIXEL_ID);
}

const eventId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}.${Math.random().toString(36).slice(2)}`;

/**
 * One event, sent twice under one ID: through the pixel in the browser and
 * through /api/meta to the Conversions API, so Meta keeps whichever arrives
 * and counts it once. keepalive lets the server copy finish even when it's
 * sent as the page is closing.
 */
function send(kind: "track" | "trackCustom", event: ServerEvent, params?: Params) {
  const id = eventId();
  window.fbq?.(kind, event, params ?? {}, { eventID: id });
  fetch("/api/meta", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, id, url: location.href, params, user }),
  }).catch(() => {});
}

/** Meta's standard events — the ones ads can optimise for. */
export const track = (event: StandardEvent, params?: Params) => send("track", event, params);

export const trackCustom = (event: CustomEvent, params?: Params) => send("trackCustom", event, params);

/**
 * The funnel around one form: FormView when it comes into sight, FormStart on
 * the first answer, FormStep at each new page, and FormAbandon if the visitor
 * leaves after starting without submitting — closing the dialog, navigating
 * away or closing the tab. Every event carries `form`, so one set of names
 * covers every form on the site. The submit itself is a standard event the
 * caller sends, since that's the one ads optimise for.
 */
export function useFormTracking(form: string, ref: RefObject<HTMLElement | null>, firstStep = "form") {
  const state = useRef({ viewed: false, started: false, done: false, abandoned: false, step: 1, name: firstStep, furthest: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || state.current.viewed) return;
        state.current.viewed = true;
        trackCustom("FormView", { form });
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
      trackCustom("FormAbandon", { form, step: s.step, step_name: s.name, furthest_step: s.furthest });
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
      start() {
        const s = state.current;
        if (s.started) return;
        s.started = true;
        trackCustom("FormStart", { form });
      },
      step(step: number, name: string) {
        const s = state.current;
        s.step = step;
        s.name = name;
        if (step <= s.furthest) return; // going back isn't progress
        s.furthest = step;
        trackCustom("FormStep", { form, step, step_name: name });
      },
      submit() {
        state.current.done = true;
      },
      /** A fresh attempt at the same form, e.g. "Send another". */
      reset() {
        Object.assign(state.current, { started: false, done: false, abandoned: false, step: 1, name: firstStep, furthest: 1 });
      },
    }),
    [form, firstStep],
  );
}
