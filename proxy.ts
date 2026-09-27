import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SCORE_HOST, SITE_HOST } from "@/lib/site";

/**
 * One deployment, two hosts. score.knnekt.studio serves /en/score at its root;
 * every other studio page asked for there goes back to the apex, and the old
 * /en/score on the apex forwards to the subdomain with its query intact, so
 * UTM tags on ads survive. Preview URLs and localhost match neither host and
 * pass straight through.
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  const { pathname, search } = request.nextUrl;

  if (host === SCORE_HOST) {
    if (pathname === "/") return NextResponse.rewrite(new URL(`/en/score${search}`, request.url));
    if (pathname === "/en/score") return NextResponse.redirect(`https://${SCORE_HOST}/${search}`, 308);
    return NextResponse.redirect(`https://${SITE_HOST}${pathname}${search}`, 308);
  }

  if ((host === SITE_HOST || host === `www.${SITE_HOST}`) && pathname === "/en/score") {
    return NextResponse.redirect(`https://${SCORE_HOST}/${search}`, 308);
  }

  return NextResponse.next();
}

// Pages only: /api/score, _next assets, fonts and images load on either host untouched.
export const config = {
  matcher: ["/", "/en/:path*"],
};
