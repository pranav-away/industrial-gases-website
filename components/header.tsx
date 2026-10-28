"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, site } from "@/content/site";
import { Arrow, Mark } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="header">
    <div className="container nav-row">
      <Link href="/" className="brand" aria-label={`${site.name} home`}><Mark/><span>{site.name}<small>KOLKATA · WEST BENGAL</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link aria-current={path === item.href ? "page" : undefined} key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className="nav-actions"><Link className="button button-small" href="/contact">Request a quote <Arrow diagonal/></Link><button ref={toggle} className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span/ ><span/></button></div>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav container" aria-label="Mobile navigation"><Link href="/">Home</Link>{navigation.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined}>{item.label}</Link>)}<Link href="/contact">Contact & request a quote <Arrow/></Link></nav>}
  </header>;
}
