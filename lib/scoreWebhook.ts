/** What the webhook answers with. See the note where it is read. */
type Reply = { ok?: boolean; message?: string } | null;

/**
 * Whatever a founder typed reaches a spreadsheet, and the routes that send it
 * are open to anyone, so a value that begins like a formula (= + - @, or a tab
 * or return before one) would run as one. A leading apostrophe makes Sheets
 * keep it as plain text; it doesn't show in the cell. A phone number like
 * +91… is text either way, so it reads the same.
 */
function plain(v: unknown): unknown {
  if (typeof v === "string") return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  if (Array.isArray(v)) return v.map(plain);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plain(x)]));
  return v;
}

/**
 * POSTs one record to SCORE_WEBHOOK_URL — the Apps Script that files score
 * submissions into the Sheet (scripts/sheet-webhook.gs). Never throws: a lost
 * row must not cost the founder their report, so a failure is logged under
 * `tag` and reported as `false`. Without the variable set, nothing is sent.
 */
export async function forwardToSheet(data: Record<string, unknown>, tag: string): Promise<boolean> {
  const url = process.env.SCORE_WEBHOOK_URL;
  if (!url) {
    console.log(`[${tag}] SCORE_WEBHOOK_URL not set; not forwarded`);
    return false;
  }
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(plain(data)) });
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`Webhook responded ${res.status}: ${text.slice(0, 300)}`);
    // A Google Apps Script web app always answers 200 — the platform gives it
    // no way to set a status code. So the status tells us nothing and the body
    // is the only place a rejected token or a thrown error can show up.
    let said: Reply = null;
    try {
      said = JSON.parse(text.trim() || "null") as Reply;
    } catch {
      // Not JSON: almost always Google's sign-in page, i.e. the web app isn't
      // deployed with "Who has access: Anyone".
      throw new Error(`Webhook answered with ${text.slice(0, 200)}`);
    }
    if (said && said.ok === false) throw new Error(`Webhook refused: ${said.message}`);
    return true;
  } catch (err) {
    console.error(`[${tag}] webhook failed`, err);
    return false;
  }
}
