/** Shared by the browser pixel and the Conversions API routes. */
export const PIXEL_ID = "1354970493281655";

export type StandardEvent = "PageView" | "Lead" | "Contact" | "ViewContent" | "SubmitApplication" | "Schedule" | "Purchase";
export type CustomEvent = "ScoreClick" | "FormView" | "FormStart" | "FormStep" | "FormAbandon" | "QualifiedLead";
export type MetaEvent = StandardEvent | CustomEvent;

/** Meta's standard events — the ones ads can optimise for. The rest go as custom events. */
export const STANDARD_EVENTS: MetaEvent[] = ["PageView", "Lead", "Contact", "ViewContent", "SubmitApplication", "Schedule", "Purchase"];

/**
 * The events a browser may relay through /api/meta. SubmitApplication isn't
 * one: its server copy comes from /api/score once the score is saved. Nor are
 * the pipeline events, which only Make can send, through /api/meta/server.
 */
export const BROWSER_RELAYED: MetaEvent[] = ["PageView", "Lead", "Contact", "ViewContent", "ScoreClick", "FormView", "FormStart", "FormStep", "FormAbandon"];
export type RelayedEvent = (typeof BROWSER_RELAYED)[number];

/** content_name of the score in every event about it. */
export const SCORE_CONTENT = "startup_operating_score";

/** What the two things founders pay for are called in Purchase, and their price before GST. */
export const PRODUCTS = { cohort_deposit: 15000, founders_roadmap: 50000 } as const;
export type Product = keyof typeof PRODUCTS;

/** The score's verdict as the ads see it: Door A is the fit route, the rest are standard. */
export const scoreRoute = (route: "STOP" | "B" | "A") => (route === "A" ? "fit" : "standard");

/** The venture category as the ads see it. */
export const startupType = (category: string | null) => (category === "D2C" || category === "SaaS" ? category : "Other");
