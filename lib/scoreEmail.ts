/**
 * The founder's report as an email: the short version of what the result page
 * shows — score, archetype, verdict, the six pillars and the constraints.
 * Every answer stays in the attached PDF, so the email stays readable on a
 * phone. Tables and inline styles throughout: this has to survive Gmail.
 */
import { archetypes, gateCopy, next, pillars, verdicts, type Identity, type Result } from "./score";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const INK = "#101010";
const MUTED = "#6b6b6b";
const SKY = "#0b6fb8";
const LINE = "#e4e4e4";
const PANEL = "#f4f4f4";

export const reportSubject = (r: Result) => `${r.venName}: ${r.overall}/100 on the Startup Operating Score`;

/** A pillar row: name, number, and a two-cell bar that needs no images. */
function bar(name: string, pct: number): string {
  const weak = pct < 42;
  return `<tr>
    <td style="padding:6px 0;font:400 13px/1.35 Helvetica,Arial,sans-serif;color:${INK};">${esc(name)}${weak ? ` <span style="color:${MUTED};">(constraint)</span>` : ""}</td>
    <td width="120" style="padding:6px 0 6px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
        <td width="${pct}%" height="6" style="background:${SKY};border-radius:3px 0 0 3px;font-size:0;line-height:0;">&nbsp;</td>
        <td width="${100 - pct}%" height="6" style="background:${LINE};border-radius:0 3px 3px 0;font-size:0;line-height:0;">&nbsp;</td>
      </tr></table>
    </td>
    <td width="34" align="right" style="padding:6px 0 6px 10px;font:500 13px/1.35 Helvetica,Arial,sans-serif;color:${INK};">${pct}</td>
  </tr>`;
}

export function reportEmailHtml(r: Result, id: Identity, pdfName: string): string {
  const v = verdicts[r.route];
  const a = archetypes[r.arch];
  const gates = r.gates
    .filter((g): g is Exclude<typeof g, "RESOURCING"> => g !== "RESOURCING")
    .map((g) => {
      const [name, why] = gateCopy[g];
      return `<div style="margin:0 0 10px;padding:12px 14px;border:1px solid ${SKY}33;background:${PANEL};border-radius:8px;">
        <p style="margin:0;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${SKY};">${esc(name)} · this outweighs your score</p>
        <p style="margin:6px 0 0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${INK};">${esc(why)}</p>
      </div>`;
    })
    .join("");

  const constraints = r.constraints
    .map(
      (c) => `<tr><td style="padding:10px 0;border-top:1px solid ${LINE};">
        <p style="margin:0;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${esc(c.label)}</p>
        <p style="margin:4px 0 0;font:500 14px/1.35 Helvetica,Arial,sans-serif;color:${INK};">${esc(c.name)}</p>
        <p style="margin:3px 0 0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(c.why)}</p>
      </td></tr>`,
    )
    .join("");

  const bullets = next.bullets.map((b) => `<li style="margin:0 0 6px;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${INK};">${esc(b)}</li>`).join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(reportSubject(r))}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your Startup Operating Score: ${r.overall}/100 — ${esc(a.name)}. The full report is attached.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#ffffff;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:collapse;">

  <tr><td style="font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">KNNEKT Studios · Startup Operating Score</td></tr>

  <tr><td style="padding:18px 0 0;">
    <span style="font:500 52px/1 Helvetica,Arial,sans-serif;color:${INK};">${r.overall}</span>
    <span style="font:400 15px/1 Helvetica,Arial,sans-serif;color:${MUTED};">&nbsp;/ 100</span>
  </td></tr>
  <tr><td style="padding:10px 0 0;font:400 14px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(r.venName)} · ${esc(id.name)}</td></tr>

  <tr><td style="padding:22px 0 0;border-top:1px solid ${LINE};margin-top:22px;"></td></tr>

  <tr><td style="padding:20px 0 0;">
    <p style="margin:0;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Archetype</p>
    <p style="margin:6px 0 0;font:500 17px/1.3 Helvetica,Arial,sans-serif;color:${INK};">${esc(a.name)}</p>
    <p style="margin:6px 0 0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(a.sub)}</p>
  </td></tr>

  <tr><td style="padding:18px 0 0;">
    <p style="margin:0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${INK};"><strong style="font-weight:500;">${esc(r.confidence.label)}</strong> <span style="color:${MUTED};">${r.confidence.pct}%</span></p>
    <p style="margin:5px 0 0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(r.confidence.body)}</p>
  </td></tr>

  ${gates ? `<tr><td style="padding:18px 0 0;">${gates}</td></tr>` : ""}

  <tr><td style="padding:20px 0 0;">
    <div style="padding:16px 18px;background:${PANEL};border-radius:10px;">
      <p style="margin:0;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${SKY};">${esc(v.band)} · ${esc(v.bandSub)}</p>
      <p style="margin:8px 0 0;font:500 17px/1.3 Helvetica,Arial,sans-serif;color:${INK};">${esc(v.title)}</p>
      <p style="margin:8px 0 0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${INK};">${esc(v.body)}</p>
    </div>
  </td></tr>

  <tr><td style="padding:26px 0 0;">
    <p style="margin:0 0 6px;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Your six pillars · 0–100</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      ${pillars.map((p, i) => bar(p.name, r.pct[i])).join("")}
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 0;">
    <p style="margin:0 0 4px;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Your top constraints</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${constraints}</table>
  </td></tr>

  <tr><td style="padding:24px 0 0;">
    <p style="margin:0 0 4px;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Where you stand</p>
    <p style="margin:0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${INK};">Against ${esc(r.benchName)} founders: you ${r.overall} · median ${r.bench[0]} · top third ${r.bench[1]} · scale-ready ${r.bench[2]}.</p>
  </td></tr>

  <tr><td style="padding:26px 0 0;">
    <div style="padding:16px 18px;border:1px solid ${LINE};border-radius:10px;">
      <p style="margin:0;font:500 15px/1.3 Helvetica,Arial,sans-serif;color:${INK};">${esc(next.h)}</p>
      <p style="margin:6px 0 10px;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(next.intro)}</p>
      <ul style="margin:0;padding:0 0 0 18px;">${bullets}</ul>
      <p style="margin:14px 0 0;font:500 11px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${esc(next.fine)}</p>
      <p style="margin:8px 0 0;font:400 12px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(next.note(r.route))}</p>
    </div>
  </td></tr>

  <tr><td style="padding:22px 0 0;">
    <p style="margin:0;font:400 13px/1.45 Helvetica,Arial,sans-serif;color:${MUTED};">The full report — every question, exactly as you answered it — is attached as <strong style="font-weight:500;color:${INK};">${esc(pdfName)}</strong>.</p>
  </td></tr>

  <tr><td style="padding:26px 0 0;border-top:1px solid ${LINE};margin-top:26px;">
    <p style="margin:18px 0 0;font:400 12px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};">
      Sent to ${esc(id.email)} because you completed the Startup Operating Score.<br>
      Questions, or something looks off? Reply to this email — it reaches us at hello@knnekt.studio.
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

/** The same thing as plain text, for clients that won't render HTML. */
export function reportEmailText(r: Result, id: Identity, pdfName: string): string {
  const v = verdicts[r.route];
  const a = archetypes[r.arch];
  const lines: string[] = [
    "KNNEKT STUDIOS - STARTUP OPERATING SCORE",
    "",
    `${r.overall} / 100`,
    `${r.venName} - ${id.name}`,
    "",
    `Archetype: ${a.name}`,
    a.sub,
    "",
    `${r.confidence.label} (${r.confidence.pct}%)`,
    r.confidence.body,
    "",
  ];
  for (const g of r.gates) {
    if (g === "RESOURCING") continue;
    const [name, why] = gateCopy[g];
    lines.push(`${name} - this outweighs your score`, why, "");
  }
  lines.push(`Verdict: ${v.band} - ${v.bandSub}`, v.title, v.body, "", "YOUR SIX PILLARS (0-100)");
  pillars.forEach((p, i) => lines.push(`- ${p.name}: ${r.pct[i]}${r.pct[i] < 42 ? " (constraint)" : ""}`));
  lines.push("", "YOUR TOP CONSTRAINTS");
  for (const c of r.constraints) lines.push(`- ${c.label} - ${c.name}. ${c.why}`);
  lines.push(
    "",
    `Against ${r.benchName} founders: you ${r.overall}, median ${r.bench[0]}, top third ${r.bench[1]}, scale-ready ${r.bench[2]}.`,
    "",
    next.h.toUpperCase(),
    next.intro,
    ...next.bullets.map((b) => `- ${b}`),
    "",
    next.fine,
    next.note(r.route),
    "",
    `The full report - every question, exactly as you answered it - is attached as ${pdfName}.`,
    "",
    `Sent to ${id.email} because you completed the Startup Operating Score.`,
    "Questions, or something looks off? Reply to this email - it reaches us at hello@knnekt.studio.",
  );
  return lines.join("\n");
}
