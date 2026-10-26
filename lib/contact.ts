/**
 * Where enquiries land. Kept out of the "use client" form so the server-rendered
 * Contact band can read it too: a server component importing a constant from a
 * client module gets a client reference stub, not the string.
 */
export const CONTACT_EMAIL = "hello@knnekt.studio";

/** The studio's number: the one we call founders from, so they know to pick up. */
export const CONTACT_PHONE = { display: "+91 91408 45927", tel: "+919140845927" };
