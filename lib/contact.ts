/**
 * Where enquiries land. Kept out of the "use client" form so the server-rendered
 * Contact band can read it too: a server component importing a constant from a
 * client module gets a client reference stub, not the string.
 */
export const CONTACT_EMAIL = "hello@knnekt.studio";

/** The studio's number: the one we call founders from, so they know to pick up. */
export const CONTACT_PHONE = { display: "+91 91408 45927", tel: "+919140845927" };

/** The form's Stage choices. The enquiry route checks against the same list, so anything else falls back to the first. */
export const CONTACT_STAGES: readonly string[] = ["Idea, nothing built yet", "Building, pre-launch", "In market, early customers", "Raising, or about to"];
