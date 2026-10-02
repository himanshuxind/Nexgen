import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import markUrl from "@/assets/nexgen-mark.svg";

const modes = ["CONCEPT", "PROTOTYPE", "EXPERIMENT", "IN DEVELOPMENT"] as const;

export function ArcadeExperiment() {
  const [mode, setMode] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const origin = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  return <div className="arcade-visual" onPointerMove={(event) => {
    if (!origin.current) return;
    setOffset({ x: Math.max(-95, Math.min(95, origin.current.startX + event.clientX - origin.current.x)), y: Math.max(-95, Math.min(95, origin.current.startY + event.clientY - origin.current.y)) });
  }} onPointerUp={() => { origin.current = null; }} onPointerCancel={() => { origin.current = null; }}>
    <div className="arcade-scan" aria-hidden="true" />
    <span className="arcade-mode micro">MODULE_0{mode + 1} / {modes[mode]}</span>
    <div className="arcade-object" style={{ translate: `${offset.x}px ${offset.y}px` }} onPointerDown={(event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      origin.current = { x: event.clientX, y: event.clientY, startX: offset.x, startY: offset.y };
    }} onPointerUp={() => { origin.current = null; }} role="img" aria-label="NexGen Arcade symbol, movable in the experiment space">
      <img src={markUrl} alt="" width={820} height={820} loading="lazy" draggable="false" />
    </div>
    <div className="arcade-controls" aria-label="Experiment stages">
      {modes.map((label, index) => <Button key={label} variant="ghost" className={mode === index ? "arcade-stage active" : "arcade-stage"} onClick={() => setMode(index)} aria-pressed={mode === index}><span>0{index + 1}</span>{label}</Button>)}
      <Button variant="ghost" size="icon" className="arcade-reset" onClick={() => { setOffset({ x: 0, y: 0 }); setMode(0); }} aria-label="Reset experiment" title="Reset experiment"><RotateCcw size={15} /></Button>
    </div>
  </div>;
}