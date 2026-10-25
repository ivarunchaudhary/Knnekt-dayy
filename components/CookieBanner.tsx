"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { applyConsent, onConsentChange, readConsent, saveConsent, type Consent } from "@/lib/consent";

/**
 * "Cookies, your call." Shown on a first visit, and again once the saved
 * choice expires or the banner's version is raised. The copy is the tracking
 * spec's, word for word. Reject all and Accept all are the same size and
 * weight, so saying no is as easy as saying yes. Any element with
 * `data-kc-consent-open` (the footer's "Cookie settings") reopens it on the
 * settings view, with the current choice already switched, to change or
 * withdraw it. Every choice fires a `knnekt:consent` event on window, and
 * `window.KnnektConsent.get()` returns the saved one.
 *
 * Returning visitors never see it: <head> applied their choice before any
 * tag ran (lib/consent.ts). Not modal: the page stays usable behind it.
 */
export default function CookieBanner() {
  // "unknown" on the server and through hydration, so the banner is never in the HTML.
  const saved = useSyncExternalStore(onConsentChange, () => (readConsent() ? "yes" : "no"), () => "unknown");
  /** Opened on purpose: from "Choose what to allow" or a Cookie settings link. */
  const [reopened, setReopened] = useState(false);
  const [settings, setSettings] = useState(false);
  const [choice, setChoice] = useState<Consent>({ analytics: false, ads: false });
  const opener = useRef<HTMLElement | null>(null);
  const first = useRef<HTMLInputElement>(null);

  const open = reopened || saved === "no";

  const show = useCallback(() => {
    setChoice(readConsent() ?? { analytics: false, ads: false });
    setSettings(true);
    setReopened(true);
  }, []);

  useEffect(() => {
    window.KnnektConsent = { open: show, get: readConsent };
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest<HTMLElement>("[data-kc-consent-open]");
      if (!b) return;
      e.preventDefault();
      opener.current = b;
      show();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [show]);

  useEffect(() => {
    if (open && settings) first.current?.focus();
  }, [open, settings]);

  const choose = (c: Consent) => {
    saveConsent(c);
    applyConsent(c);
    setReopened(false);
    setSettings(false);
    opener.current?.focus();
    opener.current = null;
    window.dispatchEvent(new CustomEvent("knnekt:consent", { detail: c }));
  };

  // Reopened over a choice already made, Esc leaves it as it was.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Escape" || !readConsent()) return;
    setReopened(false);
    setSettings(false);
    opener.current?.focus();
    opener.current = null;
  };

  if (!open) return null;
  return (
    <div
      className={`kc-consent${settings ? " is-settings" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={settings ? "kc-consent-settings-title" : "kc-consent-title"}
      onKeyDown={onKeyDown}
    >
      <div className="kc-consent-card">
        {settings ? (
          <div className="kc-consent-panel">
            <p className="kc-consent-title" id="kc-consent-settings-title">
              Cookie settings
            </p>
            <div className="kc-consent-opt">
              <b>Necessary</b>
              <span className="kc-consent-always">Always on</span>
              <p>Keeps the site and the Score working, and remembers this choice.</p>
            </div>
            <div className="kc-consent-opt">
              <b id="kc-consent-a">Analytics</b>
              <label className="kc-consent-switch">
                <input
                  ref={first}
                  type="checkbox"
                  aria-labelledby="kc-consent-a"
                  checked={choice.analytics}
                  onChange={(e) => setChoice((c) => ({ ...c, analytics: e.target.checked }))}
                />
                <span />
              </label>
              <p>Google Analytics and Microsoft Clarity. Shows which pages help and where people get stuck. Anything you type is hidden from recordings.</p>
            </div>
            <div className="kc-consent-opt">
              <b id="kc-consent-m">Advertising</b>
              <label className="kc-consent-switch">
                <input
                  type="checkbox"
                  aria-labelledby="kc-consent-m"
                  checked={choice.ads}
                  onChange={(e) => setChoice((c) => ({ ...c, ads: e.target.checked }))}
                />
                <span />
              </label>
              <p>Meta pixel. Measures our Facebook and Instagram ads and shows them to founders who might be interested.</p>
            </div>
            <div className="kc-consent-row">
              <button type="button" className="kc-consent-btn" onClick={() => choose(choice)}>
                Save choices
              </button>
              <button type="button" className="kc-consent-btn is-primary" onClick={() => choose({ analytics: true, ads: true })}>
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="kc-consent-intro">
            <p className="kc-consent-title" id="kc-consent-title">
              Cookies, your call.
            </p>
            <p className="kc-consent-text">
              We use cookies to see how founders use this site and the Score, and to show our ads to the right people. Nothing loads
              until you choose. <Link href="/en/privacy-policy">Privacy policy</Link>
            </p>
            <div className="kc-consent-row">
              <button type="button" className="kc-consent-btn" onClick={() => choose({ analytics: false, ads: false })}>
                Reject all
              </button>
              <button type="button" className="kc-consent-btn is-primary" onClick={() => choose({ analytics: true, ads: true })}>
                Accept all
              </button>
            </div>
            <button type="button" className="kc-consent-link" onClick={show}>
              Choose what to allow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
