import Link from "next/link";
import { Arrow } from "@/components/icons";
import { CTA, PageHero } from "@/components/shared";
import { products, quoteLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Our products", "Explore industrial oxygen manufactured by us, nitrogen supplied by us, and other industrial gases available on enquiry. Request a quote for your requirement.", "/products");
export default function Products() {
  return <><PageHero eyebrow="OUR PRODUCTS" title={<>Essential to industry.<br/><span>At the heart of our business.</span></>}><p>We manufacture industrial oxygen and supply nitrogen and other industrial gases. Explore our portfolio and tell us what you need.</p></PageHero><section className="container product-details">{products.map(product => <article key={product.id} id={product.id} className="product-detail"><div className={`product-visual product-${product.id}`}><span className="mono">{product.number} / {product.name.toUpperCase()}</span><span className="element-symbol" aria-hidden="true">{product.symbol}</span><span className="tag">{product.category}</span></div><div className="product-detail-copy"><span className="eyebrow">{product.category}</span><h2>{product.title}</h2><p>{product.description}</p><ul className="detail-list">{product.details.map(detail => <li key={detail}><span aria-hidden="true">+</span>{detail}</li>)}</ul><Link href={quoteLink(product.id)} className="button">Enquire about this gas <Arrow diagonal/></Link></div></article>)}</section><section className="container spec-note"><span className="mono">PLANNING YOUR ENQUIRY</span><p>Include your application, approximate quantity and delivery location. Our team will discuss availability, specifications and supply arrangements with you.</p></section><CTA/></>;
}
