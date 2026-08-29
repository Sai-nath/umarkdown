import type { MetadataRoute } from "next";
import { seoPageList, siteUrl } from "./seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages: MetadataRoute.Sitemap = seoPageList.map(({ slug }) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [{ url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }, ...landingPages];
}
