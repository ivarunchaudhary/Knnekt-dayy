/**
 * Every email the studio sends is a short letter: paragraphs only, the last
 * one the italic sign-off line, so it reads like a note from the team and
 * survives any client. Shared by the report email and the cohort emails.
 */

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** The close every letter ends on: the regards, then the italic line. */
export const SIGN_OFF: string[][] = [["Warm regards,", "Team Knnekt Studios"], ["Investors fund proof, not pitches. We build the proof with you."]];

/**
 * Makes the https links in an escaped line clickable. Punctuation that ends the
 * sentence ("…here: https://…/list.") stays outside the link.
 */
const linkify = (escaped: string) =>
  escaped.replace(/https:\/\/[^\s<]+?(?=[.,;:)]*(?:\s|$))/g, (url) => `<a href="${url}" style="color:#16253f;">${url}</a>`);

/** A letter as HTML. Each paragraph is a list of lines; the last paragraph is set in italic. */
export function letterHtml(title: string, paras: string[][]): string {
  const body = paras
    .map((lines, i) => {
      const italic = i === paras.length - 1 ? "font-style:italic;" : "";
      return `<p style="margin:0 0 14px;font:400 15px/1.55 ${FONT};color:#16253f;${italic}">${lines.map((l) => linkify(esc(l))).join("<br>")}</p>`;
    })
    .join("\n");
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px 16px;background:#ffffff;">
<div style="max-width:600px;">
${body}
</div>
</body></html>`;
}

/** The same letter as plain text, for clients that won't render HTML. */
export function letterText(paras: string[][]): string {
  return paras.map((lines) => lines.join("\n")).join("\n\n");
}
