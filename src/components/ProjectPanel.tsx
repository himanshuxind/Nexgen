import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
export function ProjectPanel({ project }: { project: Project }) {
  return <article className={`project-panel project-${project.color}`}>
    <div className="project-image"><img src={project.image} alt={project.imageAlt} width={1408} height={1024} loading="lazy"/><div className="project-image-meta micro"><span>FIG. {project.id.slice(-3)}</span><span>CONCEPT VISUALIZATION</span></div></div>
    <div className="project-info"><div className="project-top micro"><span>{project.id} / {project.category}</span><span className="status"><i /> {project.status}</span></div><div><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-bottom"><div className="tag-list">{project.technologies.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><Link to={project.route} params={{ slug: project.slug }} className="circle-link" aria-label={`Explore ${project.title}`}><ArrowUpRight size={24} /></Link></div></div>
  </article>;
}
