// Public, owner-editable content. Never put credentials or internal research here.
export const site = {
  // Neutral descriptor until the owner approves the final umbrella brand.
  name: "Industrial Gases",
  tagline: "OXYGEN MANUFACTURING & GAS SUPPLY",
  description: "Four decades of experience in industrial oxygen manufacturing and industrial gas supply. Based in Kolkata, with three factory locations in West Bengal.",
  experience: "40",
  leadership: "Mr. Anirudh Jalan",
  contact: { phone: "", whatsapp: "", email: "", officeAddress: "" },
};

export const products = [
  { id: "oxygen", name: "Industrial oxygen", symbol: "O₂", number: "01", category: "Manufactured by us", title: "Oxygen. At the core of what we do.", description: "We manufacture industrial oxygen. Tell us about your process, approximate requirement and delivery location so our team can discuss your needs.", short: "Industrial oxygen manufacturing, backed by four decades of experience.", details: ["Our manufacturing focus", "Discuss your industrial requirement", "Ask our team about specifications"] },
  { id: "nitrogen", name: "Nitrogen", symbol: "N₂", number: "02", category: "Supplied by us", title: "Nitrogen for your industrial requirements.", description: "We supply nitrogen to industrial buyers. Share your application and expected requirement with our team to discuss availability and suitable supply arrangements.", short: "Nitrogen supply for industrial buyers. Share your requirements with us.", details: ["Part of our supply portfolio", "Availability confirmed on enquiry", "Supply requirements discussed individually"] },
  { id: "other", name: "Other industrial gases", symbol: "+", number: "03", category: "Enquire for availability", title: "A specific gas requirement? Start here.", description: "Looking for another industrial gas? Tell us the gas name and intended application. Our team will confirm whether we can meet your requirement.", short: "Tell us the gas you need. Our team will confirm availability.", details: ["Specify the gas you require", "Include your intended application", "Availability confirmed by our team"] }
] as const;

export const factories = [
  { id: "howrah", number: "01", name: "Howrah", region: "WEST BENGAL", description: "One of our three factory locations, in Howrah.", address: "", company: "", mapUrl: "", image: "" },
  { id: "junglepur", number: "02", name: "Junglepur", region: "HOWRAH · WEST BENGAL", description: "Our factory presence in Junglepur, Howrah, forms part of our West Bengal network.", address: "", company: "", mapUrl: "", image: "" },
  { id: "durgapur", number: "03", name: "Durgapur", region: "WEST BENGAL", description: "Our Durgapur location completes our three-factory network in West Bengal.", address: "", company: "", mapUrl: "", image: "" }
];

export const companies = [
  { name: "Devi Gas Products Private Limited", description: "One of our owned group companies operating in the industrial gases business.", cin: "U23201WB2004PTC098697", incorporated: "31 May 2004", legalDetailsApproved: false },
  { name: "Prestige Properties Pvt Ltd", description: "Part of our group’s industrial gases business.", cin: "U74110WB1985PTC038706", incorporated: "19 March 1985", legalDetailsApproved: false },
  { name: "Rajasthan Fertilisers & Chemicals Corporation Ltd", description: "One of the three owned group companies in our industrial gases business.", cin: "U24295WB1962PLC028663", incorporated: "11 October 1962", legalDetailsApproved: false }
];

export const navigation = [
  { href: "/about", label: "About us" },
  { href: "/products", label: "Products" },
  { href: "/factories", label: "Our factories" },
  { href: "/group-companies", label: "Our group" }
];

export function quoteLink(product?: string) {
  return product ? `/contact?gas=${encodeURIComponent(product)}` : "/contact";
}

export function phoneLink(number: string) {
  const clean = number.replace(/[\s().-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(clean) ? `tel:${clean}` : null;
}

export function whatsappLink(number: string) {
  const clean = number.replace(/[\s().+-]/g, "");
  return /^[1-9]\d{7,14}$/.test(clean) ? `https://wa.me/${clean}` : null;
}

export function emailLink(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}
