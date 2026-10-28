import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return ["", "/about", "/products", "/factories", "/group-companies", "/contact", "/privacy"].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
