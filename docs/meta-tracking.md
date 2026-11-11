# Meta pixel + Conversions API (Cohort 01)

Built to the "Knnekt Cohort 01: Tracking Setup & Go-Live Checklist" (11 Nov 2026). Pixel / dataset `1354970493281655`.

## Event map as built

| Event | Fires when | Browser | Server | event_id | Code |
|---|---|---|---|---|---|
| PageView | every page | yes | yes, via `/api/meta` | `pv_<uuid>` | `components/MetaPixel.tsx` |
| FormStart | first thing typed into the score (page 1) | yes | yes | `fs_<application_id>` | `ScoreQuiz.tsx` `startScore` |
| Lead | page 1 of the score done (name, email, phone) | yes | yes | `ld_<application_id>` | `ScoreQuiz.tsx` IdentityForm `onNext` |
| SubmitApplication | `/api/score` has filed the finished score | yes, after the server answers | yes, from `/api/score` | `sa_<application_id>` | `app/api/score/route.ts` |
| QualifiedLead | team marks the lead Fit | no | yes, Make → `/api/meta/server` | `ql_<application_id>` | `app/api/meta/server/route.ts` |
| Schedule | Selection Session booked | no (the team books it, no confirmation page) | yes, Make → `/api/meta/server` | `sc_<application_id>` | same |
| Purchase | deposit / roadmap payment captured | no (the payment link is off-site) | yes, Make → `/api/meta/server` | `pu_<payment_id>` | same |

Still firing as before: FormView, FormStep, FormAbandon, ScoreClick, ViewContent, Contact. FormStart also fires for the contact form with `form: contact`, so filter RT_FormStarters on `content_name = startup_operating_score` (or `form = score`).

`application_id` is the score's session ID. It's made when the score opens, kept in `sessionStorage`, and saved in the Sheet's **Session** column. `route` is `fit` for Door A and `standard` otherwise. `startup_type` is D2C, SaaS or Other.

## Rules the code keeps

- Nothing goes to Meta, from the browser or the server, until the visitor allows advertising cookies. Pipeline events need `ads_consent: true` from the lead row.
- Only the live site reports. Localhost and Vercel previews are skipped unless `META_CAPI_TEST_CODE` is set (server) or `NEXT_PUBLIC_META_ANY_HOST=1` (browser).
- Lead and SubmitApplication fire once per application (sessionStorage flags plus fixed IDs).
- Every Conversions API call is logged in Vercel as `[capi] sent <event> <id> events_received=… fbtrace_id=…` or `[capi] FAILED …`. Network errors, 429 and 5xx are retried, 3 tries in all. Check Vercel logs for `[capi] FAILED` daily.

## Lead record (Sheet)

The Submissions and Half filled tabs now also get: utm_source, utm_medium, utm_campaign, utm_term (ad set), utm_content (ad), fbclid, Landing page, Landed at, fbp, fbc, IP, User agent, Ads consent. Paste the new `scripts/sheet-webhook.gs` into Apps Script and deploy a new version (Deploy → Manage deployments → pencil → New version), or these columns won't appear.

## Pipeline events (Make)

`POST https://knnekt.studio/api/meta/server` with `Authorization: Bearer <META_EVENTS_SECRET>` (falls back to `EMAIL_API_SECRET` when unset).

```json
{
  "event": "QualifiedLead | Schedule | Purchase",
  "application_id": "<Session column>",
  "email": "", "phone": "", "name": "", "city": "",
  "fbp": "", "fbc": "", "client_ip": "<IP column>", "user_agent": "<User agent column>",
  "ads_consent": true,
  "event_time": "<ISO or Unix, when it happened; default now; max 7 days old>",
  "route": "fit",
  "session_date": "2026-11-18",
  "payment_id": "pay_…", "content_name": "cohort_deposit | founders_roadmap", "value": 15000,
  "dryRun": true
}
```

- `route` applies to QualifiedLead, `session_date` to Schedule, and `payment_id` / `content_name` / `value` to Purchase. `value` is the price before GST and defaults to 15000 or 50000.
- `dryRun: true` returns the exact body Meta would get and sends nothing. Use it while building the scenario.
- Make triggers to wire: Fit set → QualifiedLead; Selection Session booked (stage Invited) → Schedule; Deposit paid → Purchase. Also set `booked` / `deposit_paid` and their dates on the row (for the KN_Booked / KN_Deposit customer lists).

## Env vars (Vercel)

| Var | Needed | Notes |
|---|---|---|
| `META_CAPI_TOKEN` | yes | Events Manager → KNNEKT Pixel → Settings → Conversions API → Generate access token |
| `META_EVENTS_SECRET` | recommended | Bearer secret for `/api/meta/server` |
| `META_CAPI_TEST_CODE` | testing only | Every server event goes to Test events while it's set. **Remove before go-live**, or real events won't count. |
