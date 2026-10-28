"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="section container not-found"><p className="eyebrow">SOMETHING WENT WRONG</p><h1>Please try again.</h1><p>We couldn’t load this page. You can retry below.</p><button className="button" onClick={reset}>Reload this page →</button></section>; }
