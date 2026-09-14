"use client";

import { useMemo, useState } from "react";

export const CONTACT_EMAIL = "hello@knnekt.studio";

const stages = ["Idea, nothing built yet", "Building, pre-launch", "In market, early customers", "Raising, or about to"];
const interests = [
  "Start with the Startup Operating Score",
  "The 90-Day Cohort",
  "The Founder’s Roadmap",
  "Build & Scale",
  "Not sure yet — tell me what I need",
];

type Fields = { name: string; email: string; startup: string; stage: string; interest: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", email: "", startup: "", stage: stages[0], interest: interests[0], message: "" };

/** Deliberately loose: enough to catch a typo, never enough to reject a real address. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Tell us who you are.";
  if (!f.email.trim()) e.email = "We need somewhere to reply.";
  else if (!looksLikeEmail(f.email)) e.email = "That address doesn’t look right.";
  if (f.message.trim().length < 10) e.message = "A sentence or two is plenty — but we need one.";
  return e;
}

const fieldClass =
  "mt-2 w-full rounded-lg border border-black/10 bg-gray-100 px-4 py-3 text-sm outline-none transition-colors placeholder:text-dark-very-subtle focus:border-dark/40 focus:bg-white";
const labelClass = "mono-text text-dark/80 block font-mono";
const errorClass = "mono-text mt-2 block font-mono text-[#b3261e]";

/**
 * The enquiry form. There is no inbox on the other end of this site yet, so a
 * valid submission composes the mail instead of posting it — every field is
 * carried into the body, so nothing the founder typed is lost in the handover.
 * Swap the body of `onSubmit` for a server action when an email provider is
 * wired up; the validation and the states around it don't change.
 */
export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const mailto = useMemo(() => {
    const subject = `New enquiry — ${fields.name.trim() || "Founder"}${fields.startup.trim() ? ` · ${fields.startup.trim()}` : ""}`;
    const body = [
      `Name: ${fields.name.trim()}`,
      `Email: ${fields.email.trim()}`,
      `Startup: ${fields.startup.trim() || "—"}`,
      `Stage: ${fields.stage}`,
      `Looking for: ${fields.interest}`,
      "",
      fields.message.trim(),
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [fields]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    window.location.href = mailto;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-dark rounded-xl bg-white p-6 md:p-10">
        <p className="mono-text text-dark-very-subtle font-mono">Handed to your mail app</p>
        <p className="mt-5 text-xl leading-tight font-medium lg:text-2xl">
          Your message is drafted and addressed. Hit send and we’ll come back inside two working days.
        </p>
        <p className="text-dark-subtle mt-5 text-sm leading-tight">
          Nothing opened?{" "}
          <a className="text-dark underline underline-offset-4" href={mailto}>
            Open it again
          </a>{" "}
          or write to{" "}
          <a className="text-dark underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p className="mt-8">
          <button
            type="button"
            onClick={() => {
              setFields(empty);
              setSent(false);
            }}
            className="mono-text bg-dark hover:bg-dark/80 rounded-full px-7 py-3 font-mono text-white outline-offset-2 outline-black transition-colors"
          >
            Send another
          </button>
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="text-dark rounded-xl bg-white p-6 md:p-8 lg:p-10">
      <h3 className="font-medium">Tell us where you are.</h3>
      <p className="text-dark-subtle mt-1 text-sm leading-tight">
        Five fields. We read every one of these ourselves and reply inside two working days.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <p>
          <label className={labelClass} htmlFor="contact-name">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            className={fieldClass}
            placeholder="Ada Sharma"
            value={fields.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <span id="contact-name-error" className={errorClass}>
              {errors.name}
            </span>
          )}
        </p>
        <p>
          <label className={labelClass} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={fieldClass}
            placeholder="you@startup.com"
            value={fields.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <span id="contact-email-error" className={errorClass}>
              {errors.email}
            </span>
          )}
        </p>
        <p>
          <label className={labelClass} htmlFor="contact-startup">
            Startup <span className="text-dark-very-subtle">(optional)</span>
          </label>
          <input
            id="contact-startup"
            name="startup"
            autoComplete="organization"
            className={fieldClass}
            placeholder="What it’s called"
            value={fields.startup}
            onChange={set("startup")}
          />
        </p>
        <p>
          <label className={labelClass} htmlFor="contact-stage">
            Stage
          </label>
          <select id="contact-stage" name="stage" className={fieldClass} value={fields.stage} onChange={set("stage")}>
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </p>
        <p className="sm:col-span-2">
          <label className={labelClass} htmlFor="contact-interest">
            What you’re after
          </label>
          <select id="contact-interest" name="interest" className={fieldClass} value={fields.interest} onChange={set("interest")}>
            {interests.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </p>
        <p className="sm:col-span-2">
          <label className={labelClass} htmlFor="contact-message">
            What’s the constraint right now?
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="The honest version. What’s actually stuck?"
            value={fields.message}
            onChange={set("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <span id="contact-message-error" className={errorClass}>
              {errors.message}
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          className="mono-text bg-dark hover:bg-dark/80 rounded-full px-7 py-3 font-mono text-white outline-offset-2 outline-black transition-colors"
        >
          Send it
        </button>
        <span className="mono-text text-dark/50 font-mono">Opens in your mail app</span>
      </div>
    </form>
  );
}
