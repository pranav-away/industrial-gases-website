import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactLinks, Eyebrow, PageHero } from "@/components/shared";
import { Pin } from "@/components/icons";
import { factories, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact & request a quote", "Request a quotation for industrial oxygen, nitrogen or another industrial gas. Share your requirement with our Kolkata-based team.", "/contact");
export default function Contact() {
  return <><PageHero eyebrow="CONTACT & REQUEST A QUOTE" title={<>A clear requirement.<br/><span>A useful conversation.</span></>}><p>Looking for industrial oxygen, nitrogen or another industrial gas? Share a few details to get started.</p></PageHero><section className="section container contact-layout"><aside className="contact-aside"><Eyebrow>INDUSTRIAL GAS ENQUIRIES</Eyebrow><h2>Let’s talk<br/>about your needs.</h2><p>Whether you have a defined requirement or an initial question, our team can discuss the next step.</p><div className="contact-detail"><Pin/><div><h3>Based in Kolkata</h3><p>West Bengal, India</p>{site.contact.officeAddress && <address>{site.contact.officeAddress}</address>}</div></div><div className="contact-links"><ContactLinks/></div><div className="contact-network"><span className="mono">OUR FACTORY LOCATIONS</span>{factories.map(factory => <p key={factory.id}>{factory.name}{factory.id === "junglepur" ? ", Howrah" : ""}</p>)}</div><div className="enquiry-tip"><span className="tiny-cross">+</span><p><strong>A little detail helps.</strong><br/>Include your application, approximate quantity and delivery location, if known.</p></div></aside><Suspense fallback={<div className="enquiry-form" role="status">Loading enquiry form…</div>}><EnquiryForm/></Suspense></section></>;
}
