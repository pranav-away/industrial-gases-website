import Link from "next/link";
export default function NotFound() { return <section className="section container not-found"><p className="eyebrow">PAGE NOT FOUND</p><h1>Let’s get you<br/>back on track.</h1><p>The page you’re looking for could not be found.</p><Link href="/" className="button">Return to home →</Link></section>; }
