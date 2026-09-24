/**
 * Sending the report. One provider behind one function, called over its REST
 * API rather than an SDK, so swapping it out is a change to this file alone.
 * Everything is read from the environment at call time: nothing here should
 * throw at build time when the keys aren't set yet.
 */

export const FROM = process.env.SCORE_FROM_EMAIL || "KNNEKT Studios <hello@knnekt.studio>";
export const REPLY_TO = process.env.SCORE_REPLY_TO || "hello@knnekt.studio";

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachment?: { filename: string; base64: string };
};

export type MailResult = { sent: true; id: string | null } | { sent: false; reason: "unconfigured" | "failed"; error?: string };

/** Posts the mail to Resend. Returns rather than throws: the caller decides. */
export async function sendMail(mail: Mail): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "unconfigured" };

  // The studio's copy of every report. Without SCORE_BCC it goes to the reply-to inbox.
  const bcc = (process.env.SCORE_BCC || REPLY_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [mail.to],
        ...(bcc.length ? { bcc } : {}),
        reply_to: REPLY_TO,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.attachment ? { attachments: [{ filename: mail.attachment.filename, content: mail.attachment.base64 }] } : {}),
      }),
    });
    const body = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok) return { sent: false, reason: "failed", error: body?.message || `Resend responded ${res.status}` };
    return { sent: true, id: body?.id ?? null };
  } catch (err) {
    return { sent: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }
}
