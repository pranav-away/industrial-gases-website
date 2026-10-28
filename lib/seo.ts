import type { Metadata } from "next";
import { site } from "@/content/site";

const configured = process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = configured ? new URL(configured).origin : undefined;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: siteUrl ? { canonical: `${siteUrl}${path}` } : undefined,
    openGraph: { title: `${title} | ${site.name}`, description, type: "website", url: siteUrl ? `${siteUrl}${path}` : undefined, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Industrial oxygen manufacturing and gas supply, Kolkata" }] },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: ["/opengraph-image"] }
  };
}
