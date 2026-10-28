import { CompanyList, CTA, Eyebrow, PageHero } from "@/components/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Our group companies", "Meet Devi Gas Products Private Limited, Prestige Properties Pvt Ltd and Rajasthan Fertilisers & Chemicals Corporation Ltd, our owned group companies in industrial gases.", "/group-companies");
export default function GroupCompanies() {
  return <><PageHero eyebrow="OUR GROUP COMPANIES" title={<>Three companies.<br/><span>A shared industrial focus.</span></>}><p>Our owned group companies operate in the industrial gases business, under the leadership of Mr. Anirudh Jalan.</p></PageHero><section className="section container group-grid"><div><Eyebrow>OUR GROUP</Eyebrow><h2>Experience across<br/>our companies.</h2><p>Our group brings together industrial oxygen manufacturing and industrial gas supply, with a Kolkata base and factory locations in West Bengal.</p><p>Our four decades of operating experience describe the group’s business journey.</p></div><CompanyList detailed/></section><CTA/></>;
}
