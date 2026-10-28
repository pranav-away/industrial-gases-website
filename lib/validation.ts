export type Enquiry = {
  name: string; company: string; phone: string; email: string; gas: string;
  quantity: string; location: string; message: string; website: string; formId: string;
};
export type FieldErrors = Partial<Record<keyof Enquiry, string>>;
export const gasLabels: Record<string, string> = { oxygen: "Industrial oxygen", nitrogen: "Nitrogen", other: "Other — please specify" };
const limits: Record<keyof Enquiry, number> = { name: 100, company: 160, phone: 40, email: 254, gas: 20, quantity: 240, location: 200, message: 3000, website: 200, formId: 80 };

export function validateEnquiry(input: unknown): { data: Enquiry; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const data = {} as Enquiry;
  for (const key of Object.keys(limits) as (keyof Enquiry)[]) {
    const value = source[key];
    if (value !== undefined && typeof value !== "string") errors[key] = "Please enter text in this field.";
    data[key] = typeof value === "string" ? value.trim() : "";
    if (data[key].length > limits[key]) errors[key] = `Please use ${limits[key]} characters or fewer.`;
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(data[key])) errors[key] = "Please remove unsupported characters.";
  }
  if (!data.name) errors.name = "Please enter your name.";
  if (!Object.hasOwn(gasLabels, data.gas)) errors.gas = "Please choose a gas.";
  if (!data.phone && !data.email) { errors.phone = "Enter a phone number or email so we can reply."; errors.email = "Enter an email or phone number so we can reply."; }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";
  const digits = data.phone.replace(/\D/g, "");
  if (data.phone && (!/^[+\d\s().-]+$/.test(data.phone) || digits.length < 7 || digits.length > 15)) errors.phone = "Enter a usable phone number, including your country code.";
  if (data.gas === "other" && !data.message) errors.message = "Tell us which gas you need.";
  if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(data.formId)) errors.formId = "Please refresh the page and try again.";
  return { data, errors };
}
