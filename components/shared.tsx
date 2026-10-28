import Link from "next/link";
import Image from "next/image";
import { companies, emailLink, factories, phoneLink, products, quoteLink, site, whatsappLink } from "@/content/site";
import { Arrow, Mark, Pin } from "./icons";

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span/>{children}</p>;
}
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return <section className="page-hero"><div className="container"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1><div className="page-intro">{children}</div></div><span className="hero-ring" aria-hidden="true"/></section>;
}
export function ProductCards() {
  return <div className="product-grid">{products.map(product => <article className={`product-card product-${product.id}`} key={product.id}>
    <div className="product-top"><span className="mono">{product.number} / INDUSTRIAL GASES</span><Arrow diagonal/></div><div className="element-symbol" aria-hidden="true">{product.symbol}</div><p className="tag">{product.category}</p><h3>{product.name}</h3><p>{product.short}</p><Link href={quoteLink(product.id)} className="text-link">Enquire about this gas <Arrow/></Link>
  </article>)}</div>;
}
export function FactoryCards({ detailed = false }: { detailed?: boolean }) {
  return <div className="factory-grid">{factories.map(factory => <article className="factory-card" id={factory.id} key={factory.id}>
    <div className="factory-image">{factory.image ? <Image src={factory.image} alt={`${factory.name} factory`} fill sizes="(max-width: 700px) 100vw, 33vw"/> : <Image src="/factory.svg" alt="Illustration of industrial plant structures" fill sizes="(max-width: 700px) 100vw, 33vw"/>}<span className="image-caption">{factory.image ? factory.name : "INDUSTRIAL ILLUSTRATION"}</span><span className="factory-index">{factory.number}</span></div>
    <div className="factory-body"><p className="mono">{factory.region}</p><h3><Pin/>{factory.name}</h3>{detailed && <p>{factory.description}</p>}{factory.address && <address>{factory.address}</address>}{factory.company && <p className="factory-company">{factory.company}</p>}{factory.mapUrl && /^https:\/\//.test(factory.mapUrl) ? <a className="text-link" href={factory.mapUrl} target="_blank" rel="noopener noreferrer">View verified directions <Arrow diagonal/></a> : <Link className="text-link" href={`/contact?location=${encodeURIComponent(factory.name)}`}>Enquire about this location <Arrow/></Link>}</div>
  </article>)}</div>;
}
export function CTA() {
  return <section className="cta-section"><div className="container cta-inner"><div><Eyebrow light>LET’S TALK REQUIREMENTS</Eyebrow><h2>Your next gas requirement.<br/><span>Let’s discuss it.</span></h2><p>Tell us what you need, how much you need and where you need it.</p></div><Link className="button button-white" href="/contact">Request a quote <Arrow diagonal/></Link></div></section>;
}
export function CompanyList({ detailed = false }: { detailed?: boolean }) {
  return <div className="company-list">{companies.map((company, index) => <article key={company.name} className="company-row"><span className="company-number mono">0{index + 1}</span><div><h3>{company.name}</h3>{detailed && <><p>{company.description}</p>{company.legalDetailsApproved && <details><summary>Company details</summary><dl><dt>CIN</dt><dd>{company.cin}</dd><dt>Incorporated</dt><dd>{company.incorporated}</dd></dl></details>}</>}</div>{!detailed && <Arrow diagonal/>}</article>)}</div>;
}
export function ContactLinks() {
  const phone = phoneLink(site.contact.phone), whatsapp = whatsappLink(site.contact.whatsapp), email = emailLink(site.contact.email);
  return <>{phone && <a className="text-link" href={phone}>Call our sales team <Arrow/></a>}{whatsapp && <a className="text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <Arrow diagonal/></a>}{email && <a className="text-link" href={email}>{site.contact.email} <Arrow/></a>}</>;
}
export function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-top"><div className="footer-about"><Link className="brand" href="/"><Mark/><span>{site.name}<small>KOLKATA · WEST BENGAL</small></span></Link><p>Four decades of experience in industrial oxygen manufacturing and industrial gas supply.</p><ContactLinks/></div><div className="footer-column"><p className="mono">EXPLORE</p><Link href="/about">About us</Link><Link href="/products">Our products</Link><Link href="/group-companies">Our group companies</Link><Link href="/contact">Contact us</Link></div><div className="footer-column"><p className="mono">OUR FACTORY NETWORK</p>{factories.map(factory => <Link key={factory.id} href={`/factories#${factory.id}`}>{factory.name}{factory.id === "junglepur" ? ", Howrah" : ""}</Link>)}<span className="footer-location">Based in Kolkata, West Bengal</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span>For industrial enquiries.</span><Link href="/privacy">Privacy notice</Link></div></div></footer>;
}
