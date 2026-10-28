# Delivery verification

Checked 28 October 2026 using Node.js 24.16.0 and the versions pinned in `package-lock.json`.

- Production `next build`: passed. Six main pages, privacy, generated PNG social image, sitemap, robots and server-side enquiry route compiled successfully.
- TypeScript: passed (standalone check and Next.js production build).
- Automated tests: 17 passed. Provider calls were mocked; no live enquiry emails were sent.
- Production dependency audit: no vulnerabilities reported at verification time.
- Local HTTP smoke check: home, about, products, factories, group companies, contact, privacy, robots, sitemap and social image returned HTTP 200. Unknown route returned 404.
- Internal link crawl: 15 unique local targets checked, no HTTP errors.
- Local production API: a valid enquiry without configured service credentials returned HTTP 503 with the expected unavailable message, rather than claiming success.
- Chrome visual review: desktop homepage, products navigation, and contact page at the iPhone 16 preset (393 × 852). The mobile form uses one column, keeps the quote action in the header, and preselects Industrial oxygen for `/contact?gas=oxygen`.
- Browser form check: entered a dummy name and email and confirmed gas preselection. Error and retry behaviour was checked through the HTTP endpoint and automated tests; a complete browser submission could not be reliably verified through the native browser controls.

## Remaining live checks

Resend, Upstash, a production domain and approved sales contacts have not been connected or provisioned. After configuring them, submit a real enquiry from the deployed Vercel site and confirm inbox delivery, reply-to behaviour and production rate limiting. Full provider acceptance/failure logic was tested using controlled responses; live delivery is not verified.

Without `NEXT_PUBLIC_SITE_URL`, the build warns that social image URLs use the localhost fallback. This is expected for an unconfigured local build. Set the final HTTPS origin before the production build; canonical URLs, the sitemap and indexing then use your configured origin.
