/** Shared by the browser pixel and the Conversions API route. */
export const PIXEL_ID = "1354970493281655";

export type StandardEvent = "PageView" | "Lead" | "Contact";
export type CustomEvent = "FormView" | "FormStart" | "FormStep" | "FormAbandon";
export type ServerEvent = StandardEvent | CustomEvent;

/** Every event the Conversions API route will forward. */
export const SERVER_EVENTS: ServerEvent[] = ["PageView", "Lead", "Contact", "FormView", "FormStart", "FormStep", "FormAbandon"];
