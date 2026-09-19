/**
 * Startup Operating Score — Google Sheet sink.
 *
 * This is the Apps Script that turns quiz submissions into spreadsheet rows.
 * It lives in Google's editor, not in this repo's build; the copy here is the
 * source of truth so the script is reviewable, diffable and recoverable.
 *
 * It is fed by `app/api/score/route.ts`, which POSTs `payload()` from
 * `lib/score.ts` plus `report_pdf_base64`, `report_pdf_filename` and `emailed`.
 * The founder's email is sent before this runs and never depends on it.
 *
 * ── Setup (once) ────────────────────────────────────────────────────────────
 *  1. Create a Google Sheet in the studio account (not a personal one).
 *  2. Extensions → Apps Script. Delete the sample, paste this file, save.
 *  3. Set TOKEN below to any long random string of your own.
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Authorise when prompted (it asks for Sheets + Drive; that's the PDF).
 *  5. Copy the /exec URL. In Vercel → Settings → Environment Variables set
 *       SCORE_WEBHOOK_URL = <that URL>?token=<the TOKEN you chose>
 *     Redeploy the site so the variable is picked up.
 *  6. Share the Sheet, and the Drive folder named below, with whoever reads it.
 *
 * ── Changing the quiz ───────────────────────────────────────────────────────
 *  Nothing to do. Columns are found by their header text and created on demand,
 *  so a new or reworded question in `lib/score.ts` just becomes a new column.
 *  You can reorder or rename-back columns by hand; lookup is by name, not index.
 */

/** Any long random string. Must match the ?token= on SCORE_WEBHOOK_URL. */
var TOKEN = 'CHANGE-ME-to-a-long-random-string';

/** Tab that collects submissions, created if absent. */
var SHEET_NAME = 'Submissions';

/** Drive folder the report PDFs land in, created if absent. */
var FOLDER_NAME = 'Startup Operating Score — Reports';

/** Header of the column holding the link to the PDF. */
var PDF_COLUMN = 'Report PDF';

/** The fixed columns, in the order they're created. Questions follow after. */
var CORE = [
  'Submitted at',
  'Name',
  'Email',
  'Phone',
  'Venture',
  'Category',
  'Category (other)',
  'What they are building',
  'Score',
  'Verdict',
  'Archetype',
  'Primary bottleneck',
  'Secondary bottleneck',
  'Gates fired',
  'Founders',
  'Founder experience',
  'Already in place',
  'Hours a week',
  'Capital',
  'Budget band',
  'Market confidence %',
  'Benchmark model',
  'Benchmark median',
  'Benchmark top third',
  'Benchmark scale ready',
  'Raw total',
  'Community opt-in',
  'Report emailed',
  'Instrument version'
];

function doPost(e) {
  try {
    if (!e || !e.parameter || e.parameter.token !== TOKEN) return reply(false, 'Bad token');
    if (!e.postData || !e.postData.contents) return reply(false, 'No body');

    var data = JSON.parse(e.postData.contents);

    // One writer at a time: two submissions landing together must not both
    // decide they own the same new column.
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      appendSubmission(data);
    } finally {
      lock.releaseLock();
    }
    return reply(true, 'ok');
  } catch (err) {
    // Kept in Apps Script's own execution log, which is the only place a
    // failure here is visible: see the note on reply() below.
    console.error('sheet-webhook failed: ' + (err && err.stack ? err.stack : err));
    return reply(false, String(err));
  }
}

function appendSubmission(data) {
  var sheet = getSheet();
  var row = {};

  row['Submitted at'] = data.submitted_at ? new Date(data.submitted_at) : new Date();
  row['Name'] = data.name;
  row['Email'] = data.email;
  row['Phone'] = data.phone;
  row['Venture'] = data.venture_name;
  row['Category'] = data.venture_category;
  row['Category (other)'] = data.venture_category_other;
  row['What they are building'] = data.venture_description;
  row['Score'] = data.overall_readiness;
  row['Verdict'] = data.verdict_auto;
  row['Archetype'] = data.archetype;
  row['Primary bottleneck'] = data.primary_bottleneck;
  row['Secondary bottleneck'] = data.secondary_bottleneck;
  row['Gates fired'] = list(data.gates_fired);
  row['Founders'] = data.founder_count;
  row['Founder experience'] = data.founder_experience;
  row['Already in place'] = list(data.built_milestones);
  row['Hours a week'] = data.g1_hours;
  row['Capital'] = data.g2_capital;
  row['Budget band'] = data.g3_band;
  row['Market confidence %'] = data.market_confidence;
  row['Raw total'] = data.raw_total;
  row['Community opt-in'] = data.community_optin ? 'Yes' : 'No';
  row['Report emailed'] = data.emailed ? 'Yes' : 'No';
  row['Instrument version'] = data.instrument_version;

  if (data.benchmark) {
    row['Benchmark model'] = data.benchmark.model;
    row['Benchmark median'] = data.benchmark.median;
    row['Benchmark top third'] = data.benchmark.top_third;
    row['Benchmark scale ready'] = data.benchmark.scale_ready;
  }

  // Six pillars, named by whatever keys the instrument sends.
  if (data.pillars) {
    Object.keys(data.pillars).forEach(function (key) {
      row[title(key)] = data.pillars[key].pct;
    });
  }

  // Every question, in the order it was asked, headed by the question itself.
  // Duplicated question text would collide, so a repeat gets a numeric suffix.
  var seen = {};
  (data.responses || []).forEach(function (r) {
    var header = String(r.question || '').trim();
    if (!header) return;
    seen[header] = (seen[header] || 0) + 1;
    if (seen[header] > 1) header += ' (' + seen[header] + ')';
    row[header] = r.answer;
  });

  row[PDF_COLUMN] = savePdf(data);

  writeRow(sheet, row);
}

/** Decodes the attached report into Drive and returns a clickable link. */
function savePdf(data) {
  if (!data.report_pdf_base64) return '';
  var name = data.report_pdf_filename || 'startup-operating-score.pdf';
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HHmmss');
  var blob = Utilities.newBlob(Utilities.base64Decode(data.report_pdf_base64), 'application/pdf', stamp + '-' + name);
  var file = getFolder().createFile(blob);
  return '=HYPERLINK("' + file.getUrl() + '", "Open PDF")';
}

/** Places each value under its own header, adding columns that don't exist yet. */
function writeRow(sheet, row) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var index = {};
  headers.forEach(function (h, i) {
    if (h !== '') index[h] = i;
  });

  var added = [];
  Object.keys(row).forEach(function (header) {
    if (!(header in index)) {
      index[header] = headers.length + added.length;
      added.push(header);
    }
  });
  if (added.length) {
    sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]);
    headers = headers.concat(added);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  var values = new Array(headers.length).fill('');
  Object.keys(row).forEach(function (header) {
    var v = row[header];
    values[index[header]] = v === null || v === undefined ? '' : v;
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
}

function getSheet() {
  var ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function getFolder() {
  var found = DriveApp.getFoldersByName(FOLDER_NAME);
  return found.hasNext() ? found.next() : DriveApp.createFolder(FOLDER_NAME);
}

function list(v) {
  return Array.isArray(v) ? v.join(', ') : v || '';
}

/** `go_to_market` → `Go to market`, for the pillar column headers. */
function title(key) {
  var s = String(key).replace(/[_-]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Apps Script web apps always answer 200 — there is no way to set a status code.
 * So the caller's `res.ok` check can't see a failure here, and a bad token or a
 * thrown error shows up only in this body and in Extensions → Apps Script →
 * Executions. That's the place to look if rows stop appearing.
 */
function reply(ok, message) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, message: message })).setMimeType(
    ContentService.MimeType.JSON
  );
}
