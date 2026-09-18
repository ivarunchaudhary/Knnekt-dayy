import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The link preview card — what a shared URL unfurls to in iMessage, Slack, X,
 * LinkedIn, WhatsApp.
 *
 * It is the hero, restaged for a 1200×630 frame: the same studio crew under the
 * same azure sky, the wordmark and the descriptor across the top, the claim
 * sitting in the pale space below. Generated rather than drawn so the copy stays
 * a single source of truth with the page, and set in FT System Blank so the
 * preview carries the brand's own letterforms.
 *
 * Satori can't read woff2 or webp, so `assets/` holds ttf cuts of the two weights
 * used here and a pre-cropped jpg of the hero frame. That crop carries a white
 * wash — heavier at the head and foot, lightest across the middle — because the
 * card sets its type in the dark ink, and the picture's own sky holds only 3.9:1
 * against it. Washed, both bands clear 8:1 while the frame stays recognisably
 * the photograph. Nothing uses request-time
 * data, so Next renders this once at build and serves it as a static file.
 */

export const alt = "Knnekt Studios — India’s first Startup Execution Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (name: string) => readFile(join(process.cwd(), "assets", name));

const [semibold, regular, hero] = await Promise.all([
  asset("ft-system-blank-semibold.ttf"),
  asset("ft-system-blank-regular.ttf"),
  asset("og-hero.jpg"),
]);

const dark = "#16253f";
const subtle = "#16253f80";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", color: dark, fontFamily: "FT System Blank" }}>
        <img
          src={`data:image/jpeg;base64,${hero.toString("base64")}`}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 56px 60px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em" }}>Knnekt Studios</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 21, lineHeight: 1.3 }}>
              <span>India’s first Startup Execution Studio</span>
              <span style={{ color: subtle }}>Growth. Technology. AI. Legal.</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.12 }}>
            <span>Your first 100 customers.</span>
            <span>Fund-ready in 90 days.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "FT System Blank", data: semibold, weight: 600, style: "normal" },
        { name: "FT System Blank", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
