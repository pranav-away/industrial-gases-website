import { CTA, Eyebrow, FactoryCards, PageHero } from "@/components/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Our factories", "Explore our three factory locations in Howrah, Junglepur in Howrah, and Durgapur, West Bengal. Contact our team to discuss your industrial gas requirement.", "/factories");
export default function Factories() {
  return <><PageHero eyebrow="OUR FACTORY NETWORK" title={<>An established presence.<br/><span>Across West Bengal.</span></>}><p>Three factory locations. A Kolkata-based industrial gases business with four decades of experience.</p></PageHero><section className="section container"><div className="section-heading"><div><Eyebrow>THREE FACTORY LOCATIONS</Eyebrow><h2>Howrah. Junglepur.<br/>Durgapur.</h2></div><p>To discuss a location or arrange a visit,<br/>please contact our team in advance.</p></div><FactoryCards detailed/></section><section className="location-band"><div className="container"><span className="mono">BASED IN KOLKATA</span><p>Connected by a shared focus on industrial oxygen manufacturing and industrial gas supply.</p></div></section><CTA/></>;
}
