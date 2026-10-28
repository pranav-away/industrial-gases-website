# Industrial gases website — Vercel-ready source

A complete Next.js App Router project with six main pages, responsive navigation, finished copy, original industrial SVG illustrations, a quote form, server-side validation and email delivery through Resend. No database or customer accounts are needed. Enquiries are delivered to your sales mailbox; nothing is saved to Vercel's temporary filesystem.

## Run locally

Use Node.js 24 (the project specifies `24.x`).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Open the local URL printed in your terminal. The pages work without service credentials. Until Resend is configured, the form returns an honest unavailable message; it never pretends an enquiry was sent.

## Deploy to Vercel

1. Extract this folder and push its contents to a Git repository. Do not commit `.env.local`, `.next` or `node_modules`.
2. In Vercel, choose **Add New → Project**, import that repository and select the **Next.js** framework. If the project is inside a larger repository, select this folder as the Root Directory. The build command is `npm run build`; leave the Output Directory at its framework default.
3. In **Settings → Environment Variables**, add the values below for the deployment environments you use. Set Node.js to **24.x** if it is not inferred from `package.json`.
4. Deploy. When the final domain is known, update `NEXT_PUBLIC_SITE_URL` to its HTTPS origin and redeploy. Do not include a path. A production domain is needed for canonical URLs, the sitemap and indexing. Without it the site deliberately requests no indexing.
5. Make one real enquiry and verify it arrives in the configured sales inbox. Check Resend delivery events and your spam folder. Email-provider acceptance is not a guarantee of inbox delivery.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your final HTTPS origin, such as `https://your-owned-domain.in`. |
| `RESEND_API_KEY` | A server-side API key from your Resend account. |
| `ENQUIRY_FROM` | A sender at a domain verified in Resend. A display name is supported: `Sales <sales@your-owned-domain.in>`. |
| `ENQUIRY_TO` | Your real sales inbox. Multiple recipients may be comma-separated. |
| `UPSTASH_REDIS_REST_URL` | The REST endpoint of your Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | The corresponding server-side REST token. |
| `RATE_LIMIT_SALT` | A private random value, at least 32 characters. |

Generate a salt locally:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Do not prefix secrets with `NEXT_PUBLIC_`. Vercel supplies its own `VERCEL` variable. Production abuse prevention uses Upstash's atomic Redis increment and expiry, allowing five valid attempts per network address per 15 minutes. Network identifiers are HMAC-hashed; Redis counters expire after 15 minutes. A shared counter is used for unknown client addresses. Local development has an in-memory fallback; production fails closed if shared rate limiting is not configured. No paid services have been provisioned or connected in this source package.

Official references: [Vercel environment variables](https://vercel.com/docs/environment-variables), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Upstash REST API](https://upstash.com/docs/redis/features/restapi).

## Edit the website

`content/site.ts` is the public content source for brand, contact details, products, group companies and factories. Page copy is in `app/*/page.tsx`; global design rules are in `app/globals.css`.

- Replace the neutral site label **Industrial Gases** with your approved group brand. The provisional geometric mark is a simple illustration; replace `components/icons.tsx` and `public/icon.svg` with approved branding.
- Add approved sales phone, WhatsApp number, email and office address in `site.contact`. Phone should include `+` and country code; WhatsApp should include the country code. Invalid or empty actions are hidden.
- For each factory, add a confirmed `address`, `company`, HTTPS `mapUrl` and local `image` path. Put approved photographs in `public/images/` and set a path such as `/images/howrah.webp`. Use optimized WebP/AVIF images around 1600 pixels wide; Next.js handles responsive delivery. Empty factory fields are omitted publicly.
- `public/oxygen-plant.svg` and `public/factory.svg` are original illustrative assets, not factory photographs. They are visibly labelled. Product previews use molecular symbols rather than unsupported technical specifications.
- Company CINs and incorporation dates remain hidden until `legalDetailsApproved` is set to `true` for each company after document review. Do not confuse incorporation dates with the group's operating history.
- Use `products` to edit catalogue names and copy. Adding a new gas also requires updating the `gasLabels` allowlist in `lib/validation.ts`; this deliberately keeps backend accepted options explicit.
- The leadership monogram is a neutral graphic, not an approved portrait. Replace the panel in `app/about/page.tsx` when an approved photo and biography are supplied.

The business and historical research checklist is in `docs/LAUNCH-CHECKLIST.md`, outside the public assets directory. Nothing in that checklist is rendered for visitors.

## Enquiry behaviour

Product enquiry links open `/contact?gas=oxygen`, `nitrogen` or `other`, preselecting the gas. Factory enquiry links prefill the location. The form requires a name, a gas and at least one usable contact method; Other also requires a message naming the gas. All inputs are bounded and validated again on the server. The backend checks origin, limits request size, rejects honeypots and enforces a shared production rate limit. It sends plain text to Resend with an idempotency key so an unchanged retry does not send a duplicate within the provider's idempotency window.

The form retains values on errors, disables duplicate clicks while submitting, gives loading and retry feedback, and displays success only after Resend returns an accepted email ID. Rate-limit attempts include failed deliveries. No personal enquiry content or provider secrets are written to application logs by this implementation. Email retention and mailbox permissions are your responsibility; review the privacy notice before launch.

## Checks

```sh
npm run test
npm run typecheck
npm run build
```

Tests cover successful delivery acceptance using mocked provider responses, phone-only contacts, server validation, honeypots, origin checks, oversized requests, rate limiting, provider failures, missing credentials and retry idempotency. They do not send real emails or create cloud resources. See `docs/VERIFICATION.md` for the checks performed on the delivered package.

Deploy as a full Next.js app. Do not use static export: `/api/enquiries` needs a serverless runtime. No `vercel.json` is necessary for this standard Next.js setup.
