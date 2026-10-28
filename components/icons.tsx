export function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Mark() {
  return <svg width="35" height="39" viewBox="0 0 35 39" fill="none" aria-hidden="true"><path d="M17.5 1 33 10v19l-15.5 9L2 29V10L17.5 1Z" stroke="currentColor" strokeWidth="2"/><path d="M17.5 8v23M8 14v11M27 14v11" stroke="currentColor" strokeWidth="4"/></svg>;
}
export function Pin() {
  return <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
