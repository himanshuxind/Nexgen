import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => { const project = projects.find(p => p.slug === params.slug); if (!project) throw notFound(); return project; },
  head: ({ loaderData }) => { const title = `${loaderData?.title ?? "Project"} | NexGen Arcade`; const description = loaderData?.description ?? "Explore experimental technology projects from NexGen Arcade."; return { meta: [ { title }, { name: "description", content: description }, { name: "robots", content: "index,follow" }, { tagName: "link", rel: "canonical", href: `https://nexgenarcade.vercel.app/projects/${loaderData?.slug ?? ""}` }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" } ] }; },
  component: ProjectDetail,
});
function ProjectDetail() {
  const project = Route.useLoaderData();
  return <main className={`detail-page detail-${project.color}`}><SiteNav /><div className="detail-hero"><div className="detail-media"><img src={project.image} alt={project.imageAlt} width={1408} height={1024} /></div><div className="detail-overlay"><div className="micro detail-meta"><span>{project.id} / {project.category}</span><span>STATUS / {project.status}</span></div><h1>{project.title}<span>.</span></h1><p>{project.description}</p><span className="micro detail-visual-note">CONCEPT VISUALIZATION / NOT A PRODUCT PHOTOGRAPH</span></div></div><div className="detail-body"><div><span className="micro section-index">01 / THE IDEA</span><h2>AN IDEA<br /><em>IN MOTION.</em></h2></div><div><p>{project.overview}</p><div className="detail-tags">{project.technologies.map(tag => <span key={tag}>{tag}</span>)}</div></div></div><div className="detail-next"><span className="micro">CONTINUE EXPLORING</span><Link to="/projects/$slug" params={{ slug: projects.find(p => p.slug !== project.slug)?.slug ?? project.slug }}>{projects.find(p => p.slug !== project.slug)?.title} <ArrowUpRight /></Link><Link to="/" hash="projects" className="back-projects"><ArrowLeft size={16} /> ALL PROJECTS</Link></div></main>;
}
