import { ImageResponse } from "next/og";
import { site } from "@/content/site";
export const alt = "Industrial oxygen manufacturing and industrial gas supply, Kolkata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function SocialImage() {
  return new ImageResponse(<div style={{ background: "#0b2030", color: "white", width: "100%", height: "100%", padding: "70px", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}><div style={{ fontSize: 25, color: "#7ed4ff", display: "flex" }}>{site.name} · KOLKATA, WEST BENGAL</div><div style={{ fontSize: 83, lineHeight: 1.05, letterSpacing: -4, marginTop: 70, display: "flex" }}>Industrial Oxygen.</div><div style={{ fontSize: 83, lineHeight: 1.05, letterSpacing: -4, color: "#7ed4ff", display: "flex" }}>Four Decades of Experience.</div><div style={{ marginTop: 65, fontSize: 25, display: "flex" }}>OXYGEN MANUFACTURING & INDUSTRIAL GAS SUPPLY</div></div>, size);
}
