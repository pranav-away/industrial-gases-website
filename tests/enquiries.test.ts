import test from "node:test";
import assert from "node:assert/strict";
import { handleEnquiry } from "../lib/enquiries";
import { validateEnquiry } from "../lib/validation";
import { phoneLink, whatsappLink, emailLink } from "../content/site";

const valid = { name: "Test Buyer", company: "Test Company", phone: "", email: "buyer@example.com", gas: "oxygen", quantity: "Requirement to discuss", location: "Howrah", message: "Please discuss our industrial requirement.", website: "", formId: "123e4567-e89b-42d3-a456-426614174000" };
const env = { NODE_ENV: "production", VERCEL: "1", RESEND_API_KEY: "test-only-not-a-real-key", ENQUIRY_FROM: "Sales <sales@example.com>", ENQUIRY_TO: "sales@example.com", UPSTASH_REDIS_REST_URL: "https://redis.example.com", UPSTASH_REDIS_REST_TOKEN: "test-only", RATE_LIMIT_SALT: "test-only-salt-with-at-least-32-characters" };
function request(input: unknown = valid, origin = "https://example.com") { return new Request("https://example.com/api/enquiries", { method: "POST", headers: { origin, "Content-Type": "application/json", "x-vercel-forwarded-for": "192.0.2.10" }, body: JSON.stringify(input) }); }
function provider(options: { count?: number; mailStatus?: number; malformed?: boolean; redisFail?: boolean } = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input); calls.push({ url, init });
    if (url === env.UPSTASH_REDIS_REST_URL) return options.redisFail ? Response.json({ error: "unavailable" }, { status: 503 }) : Response.json({ result: options.count || 1 });
    assert.equal(url, "https://api.resend.com/emails");
    return Response.json(options.malformed ? {} : { id: "provider-accepted" }, { status: options.mailStatus || 200 });
  };
  return { calls, fetcher };
}

test("accepts an email-only enquiry after the email provider accepts it", async () => {
  const mock = provider(); const result = await handleEnquiry(request(), env, { fetch: mock.fetcher });
  assert.equal(result.status, 200); assert.deepEqual(await result.json(), { success: true, reference: valid.formId });
  assert.equal(mock.calls.length, 2);
  const email = JSON.parse(String(mock.calls[1].init?.body));
  assert.equal(email.reply_to, valid.email); assert.match(email.text, /Industrial oxygen/); assert.match(email.text, /Howrah/);
  assert.ok((mock.calls[1].init?.headers as Record<string, string>)["Idempotency-Key"]);
  assert.ok(!String(mock.calls[0].init?.body).includes("192.0.2.10"));
});
test("accepts phone-only contacts without setting an email reply-to", async () => {
  const mock = provider(); const result = await handleEnquiry(request({ ...valid, email: "", phone: "+91 90000 00000" }), env, { fetch: mock.fetcher });
  assert.equal(result.status, 200); assert.equal(JSON.parse(String(mock.calls[1].init?.body)).reply_to, undefined);
});
test("rejects missing contact information before making provider requests", async () => {
  const mock = provider(); const result = await handleEnquiry(request({ ...valid, email: "" }), env, { fetch: mock.fetcher });
  assert.equal(result.status, 400); assert.ok((await result.json()).fields.phone); assert.equal(mock.calls.length, 0);
});
test("rejects an invalid email, invalid phone, unknown gas, non-text and oversized fields", () => {
  for (const changed of [{ email: "not-an-email" }, { phone: "abcdefghi" }, { gas: "medical-oxygen" }, { name: ["Buyer"] }, { message: "x".repeat(3001) }, { formId: "bad" }]) assert.ok(Object.keys(validateEnquiry({ ...valid, ...changed }).errors).length > 0);
});
test("other gases require the gas to be specified in the message", () => {
  assert.ok(validateEnquiry({ ...valid, gas: "other", message: "" }).errors.message);
});
test("honeypot submissions are rejected without claiming success", async () => {
  const mock = provider(); const result = await handleEnquiry(request({ ...valid, website: "spam.example" }), env, { fetch: mock.fetcher });
  assert.equal(result.status, 400); assert.equal(mock.calls.length, 0);
});
test("cross-origin and missing-origin submissions are rejected", async () => {
  assert.equal((await handleEnquiry(request(valid, "https://unrelated.example"), env)).status, 403);
  const missing = request(); missing.headers.delete("origin"); assert.equal((await handleEnquiry(missing, env)).status, 403);
});
test("accepts the browser-facing host when Next.js uses an internal bind hostname", async () => {
  const req = new Request("http://0.0.0.0:3000/api/enquiries", { method: "POST", headers: { host: "localhost:3000", origin: "http://localhost:3000", "content-type": "application/json" }, body: JSON.stringify(valid) });
  const result = await handleEnquiry(req, {});
  assert.equal(result.status, 503); // Origin passed; email service is unconfigured.
  assert.match((await result.json()).error, /temporarily unavailable/);
});
test("rejects invalid JSON and oversized payloads", async () => {
  const malformed = request(); const bad = new Request(malformed.url, { method: "POST", headers: malformed.headers, body: "{" });
  assert.equal((await handleEnquiry(bad, env)).status, 400);
  assert.equal((await handleEnquiry(request({ ...valid, message: "x".repeat(17000) }), env)).status, 413);
});
test("rejects unsupported content types", async () => {
  const req = request(); req.headers.set("content-type", "text/plain"); assert.equal((await handleEnquiry(req, env)).status, 415);
});
test("enforces a shared production rate limit", async () => {
  const mock = provider({ count: 6 }); const result = await handleEnquiry(request(), env, { fetch: mock.fetcher });
  assert.equal(result.status, 429); assert.equal(result.headers.get("retry-after"), "900"); assert.equal(mock.calls.length, 1);
});
test("fails closed when production rate limiting is missing or unavailable", async () => {
  for (const overrides of [{ UPSTASH_REDIS_REST_URL: "" }, { RATE_LIMIT_SALT: "" }]) {
    const mock = provider(); const result = await handleEnquiry(request(), { ...env, ...overrides }, { fetch: mock.fetcher });
    assert.equal(result.status, 503); assert.ok(!mock.calls.some(call => call.url.includes("resend")));
  }
  const mock = provider({ redisFail: true }); assert.equal((await handleEnquiry(request(), env, { fetch: mock.fetcher })).status, 503);
});
test("missing email credentials never produce a success response", async () => {
  const mock = provider(); const result = await handleEnquiry(request(), { ...env, RESEND_API_KEY: "" }, { fetch: mock.fetcher });
  assert.equal(result.status, 503); assert.equal(mock.calls.length, 0);
});
test("provider rejection and malformed acceptance never produce success", async () => {
  for (const options of [{ mailStatus: 422 }, { malformed: true }]) {
    const mock = provider(options); const result = await handleEnquiry(request(), env, { fetch: mock.fetcher });
    assert.equal(result.status, 502); assert.equal((await result.json()).success, undefined);
  }
});
test("provider network failure produces a retryable error", async () => {
  const mock = provider(); const failing: typeof fetch = async (input, init) => {
    if (String(input).includes("resend")) throw new Error("network failure");
    return mock.fetcher(input, init);
  };
  assert.equal((await handleEnquiry(request(), env, { fetch: failing })).status, 503);
});
test("identical retries use the same email idempotency key", async () => {
  const mock = provider(); await handleEnquiry(request(), env, { fetch: mock.fetcher }); await handleEnquiry(request(), env, { fetch: mock.fetcher });
  const keys = mock.calls.filter(call => call.url.includes("resend")).map(call => (call.init?.headers as Record<string, string>)["Idempotency-Key"]);
  assert.equal(keys[0], keys[1]);
});
test("contact actions are hidden until valid details are configured", () => {
  assert.equal(phoneLink(""), null); assert.equal(whatsappLink(""), null); assert.equal(emailLink(""), null);
  assert.equal(phoneLink("+91 90000 00000"), "tel:+919000000000"); assert.equal(whatsappLink("+91 90000 00000"), "https://wa.me/919000000000"); assert.equal(emailLink("sales@example.com"), "mailto:sales@example.com");
  assert.equal(phoneLink("[SALES PHONE]"), null); assert.equal(emailLink("javascript:alert(1)"), null);
});
