import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Home-screen icon: the wordmark's K, in the brand's own typeface. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const semibold = await readFile(join(process.cwd(), "assets", "ft-system-blank-semibold.ttf"));

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#fff",
          color: "#141a22",
          fontFamily: "FT System Blank",
          fontSize: 116,
          fontWeight: 600,
          letterSpacing: "-0.05em",
        }}
      >
        K
      </div>
    ),
    { ...size, fonts: [{ name: "FT System Blank", data: semibold, weight: 600, style: "normal" }] },
  );
}
