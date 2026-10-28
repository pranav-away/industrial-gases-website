"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Arrow } from "./icons";
import { gasLabels, validateEnquiry, type FieldErrors } from "@/lib/validation";

export function EnquiryForm() {
  const search = useSearchParams();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const formId = useRef("");
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => { formId.current = crypto.randomUUID(); }, []);
  useEffect(() => { if (state === "success") success.current?.focus(); }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;
    if (!formId.current) formId.current = crypto.randomUUID();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...values, formId: formId.current };
    const validation = validateEnquiry(payload);
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      setState("error"); setMessage("Please check the highlighted fields.");
      const first = Object.keys(validation.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("submitting"); setMessage("");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setErrors(result.fields || {});
        throw new Error(result.error || "We couldn’t submit your enquiry. Please try again.");
      }
      setReference(result.reference); setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError" ? error.message : "We couldn’t connect. Your details are still here. Check your connection and try again.");
      setTimeout(() => status.current?.focus(), 0);
    }
  }

  const gasParam = search.get("gas") || "";
  const gasDefault = Object.hasOwn(gasLabels, gasParam) ? gasParam : "";
  const field = (name: keyof FieldErrors) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const error = (name: keyof FieldErrors) => errors[name] ? <span id={`${name}-error`} className="field-error">{errors[name]}</span> : null;

  if (state === "success") return <div className="form-success" ref={success} tabIndex={-1}><span className="success-check" aria-hidden="true">✓</span><p className="eyebrow">ENQUIRY SUBMITTED</p><h2>Thank you.<br/>Let’s take it from here.</h2><p>Your enquiry has been submitted to our team for review using the contact details you provided.</p><p className="reference">Reference: {reference}</p><button className="button" onClick={() => { formId.current = crypto.randomUUID(); setErrors({}); setMessage(""); setState("idle"); }}>Send another enquiry <Arrow/></button></div>;

  return <form className="enquiry-form" noValidate onSubmit={submit} ref={form} aria-busy={state === "submitting"}>
    <div className="form-heading"><h2>Tell us what you need.</h2><p>Name and gas required are essential. Add a phone number or email so we can reply.</p></div>
    <fieldset disabled={state === "submitting"}>
      <legend className="sr-only">Your enquiry details</legend>
      <div className="form-grid"><div className="form-field"><label htmlFor="name">Your name <span>(required)</span></label><input id="name" name="name" autoComplete="name" maxLength={100} required {...field("name")}/>{error("name")}</div><div className="form-field"><label htmlFor="company">Company <span>(optional)</span></label><input id="company" name="company" autoComplete="organization" maxLength={160} {...field("company")}/>{error("company")}</div></div>
      <p className="contact-hint" id="contact-hint">Please provide at least one contact method: phone or email.</p>
      <div className="form-grid"><div className="form-field"><label htmlFor="phone">Phone number</label><input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="Include country code" {...field("phone")} aria-describedby={errors.phone ? "phone-error contact-hint" : "contact-hint"}/>{error("phone")}</div><div className="form-field"><label htmlFor="email">Email address</label><input type="email" id="email" name="email" autoComplete="email" maxLength={254} {...field("email")} aria-describedby={errors.email ? "email-error contact-hint" : "contact-hint"}/>{error("email")}</div></div>
      <div className="form-field"><label htmlFor="gas">Gas required <span>(required)</span></label><select id="gas" name="gas" defaultValue={gasDefault} key={gasDefault} required {...field("gas")}><option value="">Select a gas</option>{Object.entries(gasLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{error("gas")}</div>
      <div className="form-grid"><div className="form-field"><label htmlFor="quantity">Approximate quantity / requirement <span>(optional)</span></label><input id="quantity" name="quantity" maxLength={240} placeholder="Share an estimate, if known" {...field("quantity")}/>{error("quantity")}</div><div className="form-field"><label htmlFor="location">Delivery location <span>(optional)</span></label><input id="location" name="location" maxLength={200} defaultValue={(search.get("location") || "").slice(0, 200)} placeholder="Town, city or area" {...field("location")}/>{error("location")}</div></div>
      <div className="form-field"><label htmlFor="message">Message <span>(specify the gas if you selected Other)</span></label><textarea id="message" name="message" rows={4} maxLength={3000} placeholder="Tell us about your application or any specific requirements." {...field("message")}/>{error("message")}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
      <p className="form-privacy">We use your details to respond to your enquiry. Read our <Link href="/privacy">privacy notice</Link>.</p>
      {state === "error" && <div ref={status} tabIndex={-1} className="form-error" role="alert">{message}</div>}
      <button type="submit" className="button submit-button">{state === "submitting" ? "Submitting enquiry…" : state === "error" ? "Try submitting again" : "Submit your enquiry"}{state === "submitting" ? <span className="spinner"/> : <Arrow diagonal/>}</button>
      <p className="form-footnote" aria-live="polite">{state === "submitting" ? "Please wait while we submit your enquiry." : "Our team will review availability and discuss your requirements with you."}</p>
    </fieldset>
  </form>;
}
