import { useState } from "react";
import { Button } from "@/components/ui/button";
const technologies = [
  ["AI", "Intelligence shaped around real-world problems."],
  ["ROBOTICS", "Machines built to interact with the physical world."],
  ["COMPUTER VISION", "Helping systems interpret visual information."],
  ["IoT", "Connecting devices, environments and information."],
  ["SOFTWARE", "The logic that brings systems together."],
  ["HARDWARE", "Ideas made tangible through engineered components."],
  ["AUTOMATION", "Making complex processes more responsive."],
  ["ASSISTIVE TECH", "Technology designed with human ability in mind."],
] as const;
export function TechNetwork() {
  const [selected, setSelected] = useState<number | null>(null);
  return <div className="network-wrap">
    <div className="network-field" aria-label="Interactive technology ecosystem">
      <svg className="network-lines" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true"><g>{[[126,90],[400,42],[674,90],[760,280],[675,510],[400,555],[125,510],[40,280]].map(([x,y], i) => <line key={i} x1="400" y1="300" x2={x} y2={y} className={selected === i ? "lit" : ""} />)}</g><circle cx="400" cy="300" r="160" /><circle cx="400" cy="300" r="225" /></svg>
      <div className="network-center"><span className="micro">SYSTEM / 01</span><span className="network-glyph">N</span><strong>NEXGEN<br/>CORE</strong><small>{selected === null ? "SELECT A MODULE" : "MODULE ACTIVE"}</small></div>
      {technologies.map(([label], i) => <Button key={label} variant="ghost" className={`tech-node node-${i} ${selected === i ? "selected" : ""}`} onClick={() => setSelected(selected === i ? null : i)} onMouseEnter={() => setSelected(i)}><span className="node-dot" />{label}</Button>)}
    </div>
    <div className="network-description"><span className="micro">{selected === null ? "CONNECTED DISCIPLINES" : `MODULE_0${selected + 1} / ACTIVE`}</span><p>{selected === null ? "The most interesting ideas happen between disciplines." : technologies[selected]?.[1]}</p><span className="network-progress">{selected === null ? "00" : `0${selected + 1}`} <span>/ 08</span></span></div>
  </div>;
}
