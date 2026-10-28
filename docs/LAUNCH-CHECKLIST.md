# Owner review before public launch

This is an internal development checklist. Do not move this file into `public/`.

## Business details

- [ ] Final umbrella brand name and logo. Current public label is the neutral descriptor “Industrial Gases.”
- [ ] Confirm all three full legal company names against current company documents, particularly **Rajasthan Fertilisers & Chemicals Corporation Ltd**. The initial spoken brief used “Rajasthan Fertilizers and Chemicals Private Limited”; do not substitute this unverified variant.
- [ ] Review the CINs and incorporation dates in `content/site.ts`. Only then enable the individual `legalDetailsApproved` flags.
- [ ] Confirm the first Howrah locality, supplied as **Gosridi**, including spelling. The public page currently uses only “Howrah.”
- [ ] Confirm exact factory addresses, operating-company mapping and map links for all three sites. Registered offices must not be used as factory directions without confirmation.
- [ ] Supply approved phone, WhatsApp, email and office address. No directory contacts have been copied.
- [ ] Confirm product availability and any specifications before expanding the catalogue. No purity, grade, packaging, capacities, medical capabilities or delivery promises have been added.
- [ ] Approve the leadership wording “Under the leadership of Mr. Anirudh Jalan.” Supply an approved photograph and biography if desired. No founder, chairman or managing-director designation has been inferred.
- [ ] Supply actual factory photographs and usage rights. Current visuals are explicitly illustrative.
- [ ] Supply and verify any certifications, current licences, customer references or awards you want to publish. None are currently claimed.

## Historical background — not public directions

- Devi Gas Products Private Limited: CIN U23201WB2004PTC098697; incorporation 31 May 2004. Historical PESO material associated it with De-Gaul Avenue, Durgapur, PIN 713212. Confirm the current full factory address and current operating association before publishing.
- Prestige Properties Pvt Ltd: CIN U74110WB1985PTC038706; incorporation 19 March 1985. Historical PESO material associated it with Junglepur, Howrah. Do not infer current licence validity or real-estate services from its name.
- Rajasthan Fertilisers & Chemicals Corporation Ltd: CIN U24295WB1962PLC028663; incorporation 11 October 1962. Factory mapping and exact legal name require review.
- The owner-confirmed “40 years of experience” is the group narrative. Incorporation dates do not establish when oxygen manufacturing began.
- DIN and beneficial ownership background are deliberately absent from marketing copy.

## Deployment and enquiry delivery

- [ ] Set all required Vercel environment variables from `.env.example`.
- [ ] Verify the Resend sending domain; use an authorized sender and recipient mailbox.
- [ ] Set up Upstash Redis and generate a private `RATE_LIMIT_SALT` of at least 32 characters.
- [ ] Set the canonical production origin, redeploy, and inspect `/sitemap.xml`, `/robots.txt` and social previews.
- [ ] Review the privacy notice against your real mailbox access, retention practices and service configuration.
- [ ] Submit a real enquiry from an oxygen product link, confirm receipt, reply successfully and check delivery events.
- [ ] Test phone-only and email-only contact, provider outage/error feedback and retry behaviour.
- [ ] Approve final desktop and mobile presentation using actual brand assets.
