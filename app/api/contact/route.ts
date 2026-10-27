import { NextResponse } from "next/server";
import { CONTACT_EMAIL, CONTACT_STAGES } from "@/lib/contact";
import { sendMail } from "@/lib/mailer";
import { forwardToSheet } from "@/lib/scoreWebhook";

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Body = { name?: unknown; email?: unknown; startup?: unknown; stage?: unknown; message?: unknown; website?: unknown };

/**
 * An enquiry from the contact form. Filed in the Sheet's "Enquiries" tab and
 * mailed to the studio inbox with the founder as Reply-To, so answering it is
 * one click. Either one landing is enough; if neither does, the form is told
 * so and falls back to composing the mail itself, so nothing is lost.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  // The honeypot: a field no person sees. Anything in it is a bot, which is
  // told it succeeded so it doesn't try again.
  if (field(body.website, 200)) return NextResponse.json({ ok: true });

  const name = field(body.name, 120);
  const email = field(body.email, 200).toLowerCase();
  const startup = field(body.startup, 160);
  const stage = CONTACT_STAGES.includes(field(body.stage, 80)) ? field(body.stage, 80) : CONTACT_STAGES[0];
  const message = field(body.message, 5000);
  if (!name || !looksLikeEmail(email) || !startup || message.length < 10) {
    return NextResponse.json({ error: "Name, email, startup and a message are required" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const lines: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Startup", startup],
    ["Stage", stage],
  ];

  const [mail, filed] = await Promise.all([
    sendMail({
      to: CONTACT_EMAIL,
      replyTo: email,
      bcc: [],
      subject: `New enquiry: ${name} · ${startup}`,
      text: [...lines.map(([k, v]) => `${k}: ${v}`), "", message].join("\n"),
      html: `<table style="font:14px/1.5 sans-serif">${lines
        .map(([k, v]) => `<tr><td style="padding-right:16px;color:#666">${k}</td><td>${escape(v)}</td></tr>`)
        .join("")}</table><p style="font:14px/1.5 sans-serif;white-space:pre-wrap">${escape(message)}</p>`,
    }),
    forwardToSheet({ event: "contact", submitted_at: submittedAt, name, email, startup, stage, message }, "contact"),
  ]);

  if (!mail.sent) {
    const how = mail.reason === "unconfigured" ? "RESEND_API_KEY not set" : mail.error;
    console.error("[contact] notification not sent", { email, how });
  }
  if (!mail.sent && !filed) return NextResponse.json({ error: "Couldn't deliver the enquiry" }, { status: 502 });

  return NextResponse.json({ ok: true, emailed: mail.sent, filed });
}
