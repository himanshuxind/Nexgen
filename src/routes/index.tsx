import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Instagram, Mail, MoveUpRight, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { ProjectPanel } from "@/components/ProjectPanel";
import { TechNetwork } from "@/components/TechNetwork";
import { ArcadeExperiment } from "@/components/ArcadeExperiment";
import { projects } from "@/data/projects";
import markUrl from "@/assets/nexgen-mark.svg";

const CoreScene = lazy(() => import("@/components/CoreScene"));
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "NexGen Arcade — We Build What Comes Next" },
    { name: "description", content: "NexGen Arcade is an independent technology and innovation venture exploring ambitious ideas, experimental systems, and real-world products." },
    { property: "og:title", content: "NexGen Arcade — We Build What Comes Next" },
    { property: "og:description", content: "NexGen Arcade explores AI, robotics, computer vision, IoT, assistive technology, smart agriculture, and experimental technology projects." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const stages = ["IDEA", "RESEARCH", "EXPERIMENT", "PROTOTYPE", "ENGINEER", "PRODUCT"];

function Index() {
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1250);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    if (prefersReducedMotion) return () => { disposed = true; window.clearTimeout(timer); };

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const ctx = gsap.context(() => {
          gsap.to(".hero-scene", { yPercent: 18, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
          gsap.to(".journey-orbit", { rotate: 65, ease: "none", stagger: 0.08, scrollTrigger: { trigger: ".journey", start: "top top", end: "bottom bottom", scrub: 0.8 } });
          gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
            const image = panel.querySelector(".project-image img");
            const info = panel.querySelector(".project-info");
            if (image) {
              gsap.fromTo(image, { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } });
            }
            if (info) {
              gsap.fromTo(info, { opacity: 0.45, y: 36 }, { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: panel, start: "top 85%", end: "top 40%", scrub: 0.5 } });
            }
          });
          gsap.utils.toArray<HTMLElement>(".philosophy span").forEach((word) => {
            gsap.fromTo(word, { opacity: 0.2, x: -28 }, { opacity: 1, x: 0, ease: "power2.out", scrollTrigger: { trigger: word, start: "top 85%", end: "top 55%", scrub: 0.5 } });
          });
          gsap.fromTo(".contact-inner h2", { opacity: 0.3, y: 45 }, { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: ".contact-section", start: "top 70%", end: "top 20%", scrub: 0.5 } });
        });
        return () => ctx.revert();
      });
      const stageTrigger = ScrollTrigger.create({
        trigger: ".journey",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const nextStage = Math.min(5, Math.floor(self.progress * 6));
          setStage((current) => (current === nextStage ? current : nextStage));
        },
      });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      cleanup = () => { window.removeEventListener("resize", refresh); stageTrigger.kill(); motion.revert(); };
      refresh();
    }).catch(console.error);
    return () => { disposed = true; window.clearTimeout(timer); cleanup?.(); };
  }, []);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  return <main>
    <div className={`intro ${ready ? "intro-done" : ""}`} aria-hidden="true"><div className="intro-line" /><img src={markUrl} alt="NexGen Arcade" /><span>SYSTEM INITIALIZING</span></div>
    <SiteNav home />
    <section id="lab" className="hero section-anchor">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-scene"><Suspense fallback={<div className="scene-fallback" />}><CoreScene /></Suspense></div>
      <div className="hero-edge hero-edge-left micro"><span>TECHNOLOGY / INNOVATION / ENGINEERING</span><span>EST. IN CURIOSITY</span></div>
      <div className="hero-edge hero-edge-right micro"><span>SYS_001 / ONLINE</span><span>SCROLL TO EXPLORE</span></div>
      <div className="hero-content"><div className="hero-brand"><img src={markUrl} alt="NexGen Arcade" width={820} height={820} /></div><div className="hero-main"><span className="micro hero-kicker"><i className="signal" /> INDEPENDENT TECHNOLOGY VENTURE</span><h1>WE BUILD<br /><em>WHAT COMES</em><br />NEXT<span className="hero-period">.</span></h1><div className="hero-foot"><p>An independent technology and innovation venture turning ambitious ideas into real-world products and solutions.</p><div className="hero-actions"><Button className="action-primary" onClick={() => jump("journey")}>EXPLORE NEXGEN <ArrowUpRight size={17} /></Button><Button className="action-outline" variant="outline" onClick={() => jump("projects")}>VIEW PROJECTS <ArrowRight size={17} /></Button></div></div></div></div>
      <Button className="scroll-cue" variant="ghost" onClick={() => jump("journey")} aria-label="Scroll to the innovation journey"><ArrowDown size={16} /><span>SCROLL TO EXPLORE</span></Button>
      <div className="hero-bottom micro"><span>BUILDING / EXPERIMENTING / EVOLVING</span><span>01 — 06</span></div>
    </section>

    <section id="journey" className="journey section-anchor"><div className="journey-sticky"><div className="section-heading journey-heading"><span className="micro section-index">01 / THE PROCESS</span><h2>FROM IDEA<br /><em>TO REALITY.</em></h2><p>An independent technology and innovation venture turning ambitious ideas into real-world products and solutions.Every new possibility starts somewhere. We follow the question until it becomes something real.</p></div><div className="journey-display"><div className="journey-orbit orbit-outer" /><div className="journey-orbit orbit-middle" /><div className="journey-orbit orbit-inner" /><div className="journey-core"><span className="micro">STAGE 0{stage + 1} / 06</span><strong key={stage}>{stages[stage]}</strong><span className="journey-cross">+</span></div><div className="journey-coordinate micro">X / 028.41<br />Y / 048.88</div></div><div className="journey-bottom"><div className="journey-stages">{stages.map((name, i) => <span key={name} className={i === stage ? "current" : i < stage ? "passed" : ""}><b>0{i + 1}</b> {name}</span>)}</div><div className="journey-track"><div style={{ width: `${((stage + 1) / 6) * 100}%` }} /></div></div></div></section>

    <section id="projects" className="projects-section section-anchor"><div className="section-inner"><div className="projects-intro"><div><span className="micro section-index">02 / WORK IN PROGRESS</span><h2>PROJECTS<span className="accent-dot">.</span></h2></div><p>Ideas engineered into reality.<br /><span>Different challenges. One instinct to build.</span></p></div><div className="projects-list">{projects.filter(project => project.featured).map(project => <ProjectPanel key={project.id} project={project} />)}</div><div className="projects-end micro"><span>MORE EXPERIMENTS IN MOTION</span><span>{String(projects.length).padStart(2, "0")} / ∞</span></div></div></section>

    <section id="technology" className="technology-section section-anchor"><div className="section-inner"><div className="tech-heading"><span className="micro section-index">03 / CONNECTED THINKING</span><h2>NO IDEA EXISTS<br /><em>IN ISOLATION.</em></h2><p>Our work moves between disciplines. Select a field to see how the system connects.</p></div><TechNetwork /></div></section>

    <section className="arcade-section"><div className="section-inner arcade-layout"><div className="arcade-copy"><span className="micro section-index">04 / AN OPEN SPACE FOR IDEAS</span><h2>THE<br /><em>ARCADE.</em></h2><p>The place where unfinished ideas become experiments.</p><span className="micro arcade-note">NOT A DESTINATION. A WORK IN PROGRESS.</span></div><ArcadeExperiment /></div></section>

    <section id="about" className="about-section section-anchor"><div className="section-inner"><div className="about-top micro"><span>05 / OUR PHILOSOPHY</span><span>THINKING MADE TANGIBLE</span></div><div className="philosophy"><span>THINK.</span><span>BUILD.</span><span>BREAK.</span><span>REBUILD.</span><span>INNOVATE.</span></div><div className="about-bottom"><p>Experimentation is not a detour. It is how ambitious ideas become useful technology.</p><div className="founder"><span className="micro">FOUNDER / NEXGEN ARCADE</span><strong>HIMANSHU</strong><span className="micro">INDEPENDENT BY DESIGN.</span></div></div></div></section>

    <section className="future-section"><div className="section-inner future-inner"><span className="micro section-index">WHAT COMES NEXT / UNWRITTEN</span><h2>THE FUTURE IS<br /><em>UNDER CONSTRUCTION.</em></h2><div className="future-status">{["CURRENT", "BUILDING", "EXPERIMENTING", "NEXT"].map((x,i) => <div key={x}><span className="micro">0{i + 1}</span><strong>{x}</strong><MoveUpRight size={18}/></div>)}</div></div></section>

    <section id="contact" className="contact-section section-anchor"><div className="contact-core" aria-hidden="true"><Suspense fallback={null}><CoreScene /></Suspense></div><div className="contact-inner"><span className="micro"><i className="signal" /> SYSTEM / ONLINE</span><h2>WHAT WILL YOU<br /><em>BUILD NEXT?</em></h2><p>New ideas begin with a conversation.</p><div className="contact-links"><a className="contact-item" href="mailto:himanshuxind@gmail.com"><Mail size={16} /><span>himanshuxind@gmail.com</span></a><a className="contact-item" href="https://x.com/himanshuxind" target="_blank" rel="noreferrer"><Twitter size={16} /><span>@himanshuxind</span></a><a className="contact-item" href="https://instagram.com/himanshuxind" target="_blank" rel="noreferrer"><Instagram size={16} /><span>@himanshuxind</span></a></div><span className="contact-link">BUILD WITH US <ArrowUpRight size={25} /></span><div className="contact-brand"><img src={markUrl} alt="NexGen Arcade" width={820} height={820} loading="lazy" /></div></div><footer className="site-footer micro"><span>© {new Date().getFullYear()} NEXGEN ARCADE</span><span>INDEPENDENT INNOVATION VENTURE</span><Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>BACK TO TOP ↑</Button></footer></section>
  </main>;
}
