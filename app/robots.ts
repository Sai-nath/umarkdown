import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: "https://www.unmarkdown.in",
    sitemap: "https://www.unmarkdown.in/sitemap.xml",
  };
}
