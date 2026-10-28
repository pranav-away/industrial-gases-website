import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: siteUrl ? "/" : undefined, disallow: siteUrl ? "/api/" : "/" }, sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined };
}
