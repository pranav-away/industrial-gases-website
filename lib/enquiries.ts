import { createHmac } from "node:crypto";
import { gasLabels, validateEnquiry } from "./validation";

type Environment = Record<string, string | undefined>;
type Dependencies = { fetch: typeof fetch; now: () => number };
const localLimits = new Map<string, { count: number; expires: number }>();
const maxBodyBytes = 16_384;
const generalError = "We couldn’t submit your enquiry. Your details are still here. Please try again shortly.";

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) throw new Error("too-large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid-body");
  const decoder = new TextDecoder();
  let body = "", bytes = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBodyBytes) { await reader.cancel(); throw new Error("too-large"); }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body) as unknown;
  } finally { reader.releaseLock(); }
}

async function checkRateLimit(request: Request, env: Environment, deps: Dependencies) {
  const production = env.NODE_ENV === "production";
  // On Vercel this header is populated by the platform. Outside Vercel, only use
  // the local fallback in development; production fails closed for unknown IPs.
  const ip = (env.VERCEL ? request.headers.get("x-vercel-forwarded-for") : !production ? request.headers.get("x-forwarded-for") : null)?.split(",")[0].trim() || "unknown";
  const salt = env.RATE_LIMIT_SALT;
  if (production && (!salt || salt.length < 32)) throw new Error("rate-limit-config");
  const key = "enquiry:" + createHmac("sha256", salt || "local-development-only").update(ip).digest("hex");
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n";
    const response = await deps.fetch(env.UPSTASH_REDIS_REST_URL, { method: "POST", headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", script, "1", key]), signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!response.ok) throw new Error("rate-limit-unavailable");
    const result = await response.json() as { result?: number; error?: string };
    if (result.error || typeof result.result !== "number") throw new Error("rate-limit-unavailable");
    return result.result <= 5;
  }
  if (production) throw new Error("rate-limit-config");
  const now = deps.now();
  for (const [entryKey, value] of localLimits) if (value.expires <= now) localLimits.delete(entryKey);
  const entry = localLimits.get(key) || { count: 0, expires: now + 900_000 };
  entry.count += 1;
  localLimits.set(key, entry);
  return entry.count <= 5;
}

export async function handleEnquiry(request: Request, env: Environment, dependencies?: Partial<Dependencies>) {
  const deps: Dependencies = { fetch: dependencies?.fetch || fetch, now: dependencies?.now || Date.now };
  try {
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([new URL(request.url).origin]);
    // Next.js may expose its internal bind hostname (0.0.0.0) in request.url.
    // Host is the browser-facing hostname; browsers cannot override it in fetch.
    const host = request.headers.get("host");
    if (host) allowedOrigins.add(`${env.VERCEL ? "https:" : new URL(request.url).protocol}//${host}`);
    if (env.NEXT_PUBLIC_SITE_URL) allowedOrigins.add(new URL(env.NEXT_PUBLIC_SITE_URL).origin);
    if (!origin || !allowedOrigins.has(origin)) return json({ error: "Please submit the form from our website." }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Please submit the website enquiry form." }, 415);
    let input: unknown;
    try { input = await readBody(request); }
    catch (error) { return json({ error: error instanceof Error && error.message === "too-large" ? "Your enquiry is too long. Please shorten your message." : "We couldn’t read the enquiry. Please try again." }, error instanceof Error && error.message === "too-large" ? 413 : 400); }
    const { data, errors } = validateEnquiry(input);
    if (data.website) return json({ error: "We couldn’t accept this submission. Please try again." }, 400);
    if (Object.keys(errors).length) return json({ error: "Please check the highlighted fields.", fields: errors }, 400);

    // No enquiry data or contact information is logged, even on provider errors.
    if (!env.RESEND_API_KEY || !env.ENQUIRY_FROM || !env.ENQUIRY_TO) return json({ error: "Enquiries are temporarily unavailable. Please try again later." }, 503);
    if (!await checkRateLimit(request, env, deps)) return json({ error: "Too many attempts. Please wait 15 minutes before trying again." }, 429, { "Retry-After": "900" });

    const text = ["New industrial gas enquiry", "", `Name: ${data.name}`, `Company: ${data.company || "Not provided"}`, `Phone: ${data.phone || "Not provided"}`, `Email: ${data.email || "Not provided"}`, `Gas: ${gasLabels[data.gas]}`, `Approximate quantity / requirement: ${data.quantity || "Not provided"}`, `Delivery location: ${data.location || "Not provided"}`, "", "Message:", data.message || "Not provided", "", `Enquiry reference: ${data.formId}`].join("\n");
    // Stable for an unchanged retry; changes produce a different key. Resend
    // prevents duplicates when a successful provider response is lost in transit.
    const idempotencyKey = createHmac("sha256", env.RATE_LIMIT_SALT || env.RESEND_API_KEY).update(JSON.stringify(data)).digest("hex");
    const response = await deps.fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `enquiry-${idempotencyKey}` },
      body: JSON.stringify({ from: env.ENQUIRY_FROM, to: env.ENQUIRY_TO.split(",").map(value => value.trim()).filter(Boolean), ...(data.email ? { reply_to: data.email } : {}), subject: `Industrial gas enquiry — ${gasLabels[data.gas]}`, text }),
      signal: AbortSignal.timeout(12000), cache: "no-store"
    });
    if (!response.ok) return json({ error: generalError }, 502);
    const accepted = await response.json() as { id?: string };
    if (typeof accepted.id !== "string" || !accepted.id) return json({ error: generalError }, 502);
    return json({ success: true, reference: data.formId });
  } catch { return json({ error: generalError }, 503); }
}
