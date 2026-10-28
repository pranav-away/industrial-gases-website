import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/shared";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Industrial oxygen manufacturing & gas supply in Kolkata", template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: "/icon.svg" },
  robots: { index: Boolean(siteUrl), follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b2030" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: site.name, description: site.description, ...(siteUrl ? { url: siteUrl } : {}), location: { "@type": "Place", name: "Kolkata, West Bengal, India" } };
  return <html lang="en-IN"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/></body></html>;
}
