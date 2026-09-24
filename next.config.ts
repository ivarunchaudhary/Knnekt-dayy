import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The report PDF is laid out by react-pdf (yoga + fontkit), which has to run
  // from node_modules rather than be bundled, in the site's own TTF cuts.
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: { "/api/score": ["./assets/*.ttf"] },
  async headers() {
    return [
      {
        source: "/:dir(sanity|posters|images)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
