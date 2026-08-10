import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin-login", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}