import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import markUrl from "@/assets/nexgen-mark.svg";

const sections = [
  { id: "lab", label: "LAB" },
  { id: "journey", label: "PROCESS" },
  { id: "projects", label: "PROJECTS" },
  { id: "technology", label: "TECHNOLOGY" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export function SiteNav({ home = false }: { home?: boolean }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sections.findIndex(section => section.id === entry.target.id);
          if (index >= 0) setActive(index);
        }
      });
    }, { rootMargin: "-30% 0px -55% 0px" });
    sections.forEach(section => { const el = document.getElementById(section.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [home]);
  const jump = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); };
  return <>
    <header className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="brand-link" aria-label="NexGen Arcade home" onClick={() => setOpen(false)}><img src={markUrl} alt="NexGen Arcade" width={820} height={820} /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {sections.filter(s => s.id !== "journey").map((s, i) => home ? <Button key={s.id} variant="ghost" className={active === sections.findIndex(x => x.id === s.id) ? "nav-item active" : "nav-item"} onClick={() => jump(s.id)}><span>0{i + 1}</span> {s.label}</Button> : <Link key={s.id} to="/" hash={s.id} className="nav-item"><span>0{i + 1}</span> {s.label}</Link>)}
        </nav>
        <div className="nav-end"><span className="nav-counter">0{active + 1} <span>/ 06</span></span><Button variant="ghost" size="icon" className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</Button></div>
      </div>
    </header>
    {open && <nav className="mobile-panel" aria-label="Mobile navigation">{sections.map((s, i) => home ? <Button key={s.id} variant="ghost" onClick={() => jump(s.id)}><span>0{i + 1}</span>{s.label}<ArrowUpRight size={18} /></Button> : <Link key={s.id} to="/" hash={s.id} onClick={() => setOpen(false)}><span>0{i + 1}</span>{s.label}<ArrowUpRight size={18} /></Link>)}</nav>}
  </>;
}
