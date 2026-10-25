/** Shared by the browser pixel and the Conversions API route. */
export const PIXEL_ID = "1354970493281655";

export type StandardEvent = "PageView" | "Lead" | "Contact" | "ViewContent" | "SubmitApplication";
export type CustomEvent = "ScoreClick" | "FormView" | "FormStart" | "FormStep" | "FormAbandon";
export type ServerEvent = StandardEvent | CustomEvent;

/** Meta's standard events — the ones ads can optimise for. The rest go as custom events. */
export const STANDARD_EVENTS: ServerEvent[] = ["PageView", "Lead", "Contact", "ViewContent", "SubmitApplication"];

/** Every event the Conversions API route will forward. */
export const SERVER_EVENTS: ServerEvent[] = [...STANDARD_EVENTS, "ScoreClick", "FormView", "FormStart", "FormStep", "FormAbandon"];
