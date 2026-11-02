/**
 * The Cohort 01 pipeline emails, E2 to E5. The words are the ones in Notion
 * (Knnekt OS → Message Templates); change them there first, then here. E1, the
 * report, is sent by the score route itself (see scoreEmail.ts).
 *
 * Make sends the values it reads off the founder's row and the session; this
 * file formats them. Dates arrive as ISO strings, as Notion stores them (UTC),
 * and are written out in India time, so Make never formats a date itself.
 */
import { CONTACT_PHONE } from "./contact";
import { icsFile } from "./ics";
import { letterHtml, letterText, SIGN_OFF } from "./letter";

export type Vars = Record<string, string>;
export type Attachment = { filename: string; base64: string };

/** What a template can ask for. Every key a template lists in `needs` must arrive, non-empty. */
type Kind = "text" | "name" | "date" | "datetime" | "url" | "list";

type Template = {
  name: string;
  needs: Record<string, Kind>;
  /** Optional values: used when they arrive, never required. */
  optional?: Record<string, Kind>;
  subject: (v: Vars) => string;
  letter: (v: Vars) => string[][];
  /**
   * The file the email promises, if it has one. Returns a string when it
   * can't be made: the email says "attached", so it must not go without it.
   */
  attachment?: (v: Vars, to: string) => Promise<Attachment | string | null>;
};

const TZ = "Asia/Kolkata";
const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });

/** "Sunday, 29 November 2026", in India time. */
export const day = (iso: string) => dayFmt.format(new Date(iso));
/** "6:00 pm", in India time. */
export const time = (iso: string) => timeFmt.format(new Date(iso));

const addDays = (iso: string, n: number) => new Date(new Date(iso).getTime() + n * 86_400_000).toISOString();
const firstName = (name: string) => name.split(/\s+/)[0] || name;

/** A prep list arrives as one line per item (or "·"-separated); each item is its own line. */
const items = (list: string) =>
  list
    .split(/\r?\n|\s·\s/)
    .map((s) => s.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);

/** Fetches a PDF the studio keeps at a fixed address (set in the environment). */
async function pdfFrom(envKey: string, filename: string): Promise<Attachment | string> {
  const url = process.env[envKey];
  if (!url) return `${envKey} not set`;
  try {
    const res = await fetch(url);
    if (!res.ok) return `${envKey} answered ${res.status}`;
    return { filename, base64: Buffer.from(await res.arrayBuffer()).toString("base64") };
  } catch (err) {
    return `${envKey} unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }
}

/** Default session length when the session has no end time in Notion. */
const SESSION_HOURS = 2;

export const templates: Record<string, Template> = {
  E2: {
    name: "Selection Session invitation",
    needs: { name: "name", session_start: "datetime", studio_address: "text" },
    optional: { session_end: "datetime", session_name: "text", maps_link: "url" },
    subject: (v) => `Invitation: Selection Session at Knnekt Studios, ${day(v.session_start)}`,
    letter: (v) => [
      [`Dear ${firstName(v.name)},`],
      ["It is our pleasure to invite you to a Selection Session at Knnekt Studios."],
      [`Date and time: ${day(v.session_start)}, ${time(v.session_start)}.`, `Venue: ${v.studio_address}, near Cyber City, Gurugram.`],
      [
        "The session includes:",
        "1. A group session with founders at a similar stage, covering how our 100-day programme works and what investors look for.",
        "2. A one-on-one conversation with our team on your score and your first 10 days.",
      ],
      ["We kindly request that you bring your report and any questions you would like to discuss. A calendar invitation is attached for your convenience."],
      ["We look forward to welcoming you."],
      ...SIGN_OFF,
    ],
    attachment: async (v, to) => {
      const start = new Date(v.session_start);
      const end = v.session_end ? new Date(v.session_end) : new Date(start.getTime() + SESSION_HOURS * 3_600_000);
      // One founder, one session: a rebooking to another session is a new event, a resend of the same one replaces it.
      const uid = `${(v.session_name || v.session_start).replace(/[^A-Za-z0-9]+/g, "-")}-${to.replace(/[^A-Za-z0-9]+/g, "-")}@knnekt.studio`;
      const ics = icsFile([
        {
          uid,
          start,
          end,
          title: "Selection Session, Knnekt Studios",
          location: `${v.studio_address}, near Cyber City, Gurugram`,
          description: `Please bring your report and any questions. Questions before then: ${CONTACT_PHONE.display}.`,
          ...(v.maps_link ? { url: v.maps_link } : {}),
        },
      ]);
      return { filename: "selection-session.ics", base64: Buffer.from(ics).toString("base64") };
    },
  },

  E3: {
    name: "Seat offer (agreement attached)",
    needs: { name: "name", deposit_deadline: "date", day0_date: "date", payment_link: "url" },
    subject: () => "Your seat in Cohort 01, Knnekt Studios",
    letter: (v) => [
      [`Dear ${firstName(v.name)},`],
      ["Thank you for joining us at the Selection Session. We are pleased to offer you a seat in Cohort 01. Your agreement is attached for review."],
      [
        "Programme fee: ₹3,00,000 + GST (founding price).",
        `Deposit (adjusted against the fee): ₹15,000, due ${day(v.deposit_deadline)}.`,
        `Instalment 1: ₹95,000 + GST, Day 0 (${day(v.day0_date)}).`,
        `Instalment 2: ₹95,000 + GST, Day 31 (${day(addDays(v.day0_date, 31))}).`,
        `Instalment 3: ₹95,000 + GST, Day 45 (${day(addDays(v.day0_date, 45))}).`,
      ],
      [`Deposit link: ${v.payment_link}`],
      [
        "Our commitments to you:",
        "30-Day Promise: if the programme does not feel right within the first 30 days, we will refund the amount you have paid, excluding the deposit.",
        "Goal Promise: your goal is set together on Day 10. If it is not reached by Day 100, we will continue building with you for up to 30 additional days at no cost.",
      ],
      ["The full terms are set out in the agreement. Please feel free to call us on " + CONTACT_PHONE.display + " with any questions."],
      ["We look forward to building with you."],
      ...SIGN_OFF,
    ],
    attachment: () => pdfFrom("BUILD_AGREEMENT_PDF_URL", "Knnekt-Studios-Cohort-01-Agreement.pdf"),
  },

  E4: {
    name: "Welcome",
    needs: { name: "name", day0_start: "datetime", prep_list: "list" },
    subject: () => "Welcome to Cohort 01: your next steps",
    letter: (v) => [
      [`Dear ${firstName(v.name)},`],
      ["Welcome to Cohort 01. We have received your deposit, and your seat is confirmed."],
      [
        "What happens next:",
        `Day 0, Kickoff: ${day(v.day0_start)}, ${time(v.day0_start)}, at the studio. Instalment 1 (₹95,000 + GST) is due on this day. Your studio access card will be issued once it is received.`,
        "Day 1: your 10-day Roadmap Sprint begins.",
        "Day 10: your roadmap and goal are set together with our team.",
      ],
      ["Before Kickoff, please keep the following ready:", ...items(v.prep_list).map((s) => `• ${s}`)],
      ["We are delighted to have you with us and look forward to the next 100 days."],
      ...SIGN_OFF,
    ],
    // The checklist pairs E4 with the first-10-days calendar. The letter doesn't promise it, so it goes without one until it exists.
    attachment: async () => (process.env.FIRST_TEN_DAYS_PDF_URL ? pdfFrom("FIRST_TEN_DAYS_PDF_URL", "Knnekt-Studios-First-10-Days.pdf") : null),
  },

  E5: {
    name: "Next cohort",
    needs: { name: "name", top_constraint: "text", waitlist_link: "url" },
    subject: () => "Your report and the next cohort at Knnekt Studios",
    letter: (v) => [
      [`Dear ${firstName(v.name)},`],
      ["Thank you for your time and for sharing your journey with us."],
      [`Cohort 01 may not be the right fit at this stage. Your report remains yours, and we recommend beginning with your top constraint, ${v.top_constraint}.`],
      [`To be considered for the next cohort, please register your interest here: ${v.waitlist_link}`],
      ["Once you are ready, we will call you to take the conversation forward. We wish you every success."],
      ...SIGN_OFF,
    ],
  },
};

const MAX = { name: 80, text: 300, list: 1000, url: 500 } as const;

/**
 * Checks the values for one template. Returns the cleaned values, or the list
 * of what's missing or malformed so Make's run log says exactly which field.
 */
export function checkVars(t: Template, raw: unknown): { ok: true; vars: Vars } | { ok: false; problems: string[] } {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const vars: Vars = {};
  const problems: string[] = [];
  const check = (key: string, kind: Kind, required: boolean) => {
    const v = typeof src[key] === "string" ? (src[key] as string).trim() : "";
    if (!v) {
      if (required) problems.push(`${key} is missing`);
      return;
    }
    if (kind === "date" || kind === "datetime") {
      if (Number.isNaN(new Date(v).getTime())) return problems.push(`${key} is not a date`);
      if (kind === "datetime" && !/T\d{2}:\d{2}/.test(v)) return problems.push(`${key} needs a time, not just a date`);
    } else if (kind === "url") {
      if (!/^https:\/\/\S+$/.test(v) || v.length > MAX.url) return problems.push(`${key} is not an https link`);
    } else if (v.length > MAX[kind]) {
      return problems.push(`${key} is longer than ${MAX[kind]} characters`);
    }
    vars[key] = v;
  };
  for (const [k, kind] of Object.entries(t.needs)) check(k, kind, true);
  for (const [k, kind] of Object.entries(t.optional ?? {})) check(k, kind, false);
  return problems.length ? { ok: false, problems } : { ok: true, vars };
}

export function render(t: Template, vars: Vars) {
  const subject = t.subject(vars);
  const paras = t.letter(vars);
  return { subject, html: letterHtml(subject, paras), text: letterText(paras) };
}
