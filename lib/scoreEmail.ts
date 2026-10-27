/**
 * The founder's report as an email: a short personal letter, with the full
 * report as the attached PDF. Plain on purpose — it should read like a note
 * from the team, not a newsletter — so the HTML is only paragraphs and the one
 * italic sign-off line, and survives any client.
 */
import { CONTACT_PHONE } from "./contact";
import { archetypes, type Identity, type Result } from "./score";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const reportSubject = (r: Result) => `Your Startup Operating Score: ${r.overall}/100`;

/** The letter's paragraphs, shared by the HTML and the plain text. The last is the italic sign-off. */
function letter(r: Result, id: Identity): string[][] {
  const firstName = id.name.split(/\s+/)[0] || id.name;
  return [
    [`Dear ${firstName},`],
    ["Thank you for completing the Startup Operating Score. Your personalised report is attached."],
    [`Your archetype is ${archetypes[r.arch].name}, and the constraint most in your way right now is ${r.constraints[0].name}.`],
    [
      `Our team reviews every report personally. We will call you within 24 hours from ${CONTACT_PHONE.display} to walk you through your results, discuss the first thing worth fixing, and explore whether working together would be the right step for you.`,
    ],
    ["Warm regards,", "Team Knnekt Studios"],
    ["Investors fund proof, not pitches. We build the proof with you."],
  ];
}

export function reportEmailHtml(r: Result, id: Identity): string {
  const paras = letter(r, id);
  const body = paras
    .map((lines, i) => {
      const italic = i === paras.length - 1 ? "font-style:italic;" : "";
      return `<p style="margin:0 0 14px;font:400 15px/1.55 ${FONT};color:#16253f;${italic}">${lines.map(esc).join("<br>")}</p>`;
    })
    .join("\n");
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(reportSubject(r))}</title></head>
<body style="margin:0;padding:24px 16px;background:#ffffff;">
<div style="max-width:600px;">
${body}
</div>
</body></html>`;
}

/** The same thing as plain text, for clients that won't render HTML. */
export function reportEmailText(r: Result, id: Identity): string {
  return letter(r, id)
    .map((lines) => lines.join("\n"))
    .join("\n\n");
}
