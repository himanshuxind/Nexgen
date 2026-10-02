import neurodrive from "@/assets/neurodrive.png";
import gan from "@/assets/gan.jpg";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  overview: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  model: string | null;
  featured: boolean;
  route: "/projects/$slug";
  color: "cyan" | "green";
};

export const projects: Project[] = [
  {
    id: "PROJECT_001",
    slug: "neurodrive",
    title: "NEURODRIVE",
    category: "ASSISTIVE TECHNOLOGY",
    status: "PROTOTYPE",
    description: "Exploring eye-controlled smart mobility and assistive interaction.",
    overview: "NEURODRIVE explores how eye interaction and computer vision could make mobility technology more intuitive. An experimental project at the intersection of accessible design, embedded systems and physical engineering.",
    technologies: ["COMPUTER VISION", "EYE INTERACTION", "ESP32", "MOTOR CONTROL", "OBSTACLE DETECTION"],
    image: neurodrive,
    imageAlt: "Conceptual visualization of an experimental smart mobility device",
    model: null,
    featured: true,
    route: "/projects/$slug",
    color: "cyan",
  },
  {
    id: "PROJECT_002",
    slug: "g-an",
    title: "G-AN",
    category: "SMART AGRICULTURE",
    status: "IN DEVELOPMENT",
    description: "Exploring the connection between intelligent systems and agriculture.",
    overview: "G-AN is an exploration in smart agriculture: bringing sensing, connected systems and intelligent analysis into conversation with the physical realities of farming.",
    technologies: ["AI", "SENSORS", "IOT", "AGRICULTURE"],
    image: gan,
    imageAlt: "Conceptual visualization of connected sensors across agricultural fields",
    model: null,
    featured: true,
    route: "/projects/$slug",
    color: "green",
  },
];
