import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CoreScene({ progress = 0 }: { progress?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const host = container.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrame = 0;
    let visible = true;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.2 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 11);
    const group = new THREE.Group();
    scene.add(group);

    const metal = new THREE.MeshPhysicalMaterial({ color: 0x969991, metalness: 0.92, roughness: 0.23, side: THREE.DoubleSide });
    const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x1b2615, metalness: 0.85, roughness: 0.28, side: THREE.DoubleSide });
    const energy = new THREE.MeshBasicMaterial({ color: 0xb8f36a, transparent: true, opacity: 0.72 });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.05, 1), darkMetal);
    shell.scale.set(1, 0.92, 0.56);
    group.add(shell);

    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(shell.geometry), new THREE.LineBasicMaterial({ color: 0x8dbd36, transparent: true, opacity: 0.32 }));
    wire.scale.copy(shell.scale);
    group.add(wire);

    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12, 1), metal);
    inner.scale.set(1, 1, 0.56);
    group.add(inner);

    const heart = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), new THREE.MeshPhysicalMaterial({ color: 0xb8f36a, metalness: 0.45, roughness: 0.15, emissive: 0x3a4e16, emissiveIntensity: 0.7 }));
    group.add(heart);

    const rings: THREE.Mesh[] = [];
    [2.35, 2.75].forEach((radius, i) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, i === 0 ? 0.014 : 0.012, 8, 72), i === 0 ? energy : metal);
      mesh.rotation.set(0.25 + i * 0.6, -0.38 + i * 0.62, i * 1.4);
      group.add(mesh);
      rings.push(mesh);
    });

    const particlesCount = window.innerWidth < 768 ? 45 : 110;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.4 + Math.random() * 4;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ color: 0xa9ce62, size: 0.028, transparent: true, opacity: 0.65 }));
    scene.add(points);

    scene.add(new THREE.AmbientLight(0xc8cec1, 1.1));
    const key = new THREE.PointLight(0xb8f36a, 34);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xd4d4c8, 18);
    rim.position.set(-3, -2, 2);
    scene.add(rim);

    const resize = () => {
      if (!host || !renderer) return;
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const clock = new THREE.Clock();
    const render = () => {
      if (!renderer || !visible) return;
      const t = clock.getElapsedTime();
      group.rotation.y += ((t * 0.11 + pointer.current.x * 0.18) - group.rotation.y) * 0.02;
      group.rotation.x += ((pointer.current.y * 0.12 + Math.sin(t * 0.22) * 0.1) - group.rotation.x) * 0.02;
      group.rotation.z = Math.sin(t * 0.15) * 0.05;

      rings.forEach((ring, index) => {
        if (index === 0) ring.rotation.z += 0.0013;
        else ring.rotation.y += 0.0014;
      });

      heart.rotation.y = t * 0.22;
      points.rotation.z = t * 0.006;
      group.position.y = Math.sin(t * 0.6) * 0.08;
      renderer.render(scene, camera);
    };

    const animationLoop = () => {
      render();
      animationFrame = window.requestAnimationFrame(animationLoop);
    };

    const visibilityObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      visible = entry ? entry.isIntersecting : true;
      if (visible) {
        if (!animationFrame) animationFrame = window.requestAnimationFrame(animationLoop);
      } else {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { threshold: 0.15 });
    visibilityObserver.observe(host);

    const move = (event: PointerEvent) => {
      pointer.current = {
        x: event.clientX / window.innerWidth * 2 - 1,
        y: event.clientY / window.innerHeight * 2 - 1,
      };
    };

    window.addEventListener("pointermove", move, { passive: true });
    if (visible) animationFrame = window.requestAnimationFrame(animationLoop);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", move);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (renderer) {
        host.removeChild(renderer.domElement);
        renderer.dispose();
      }
      shell.geometry.dispose();
      wire.geometry.dispose();
      inner.geometry.dispose();
      heart.geometry.dispose();
      pointsGeometry.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      metal.dispose();
      darkMetal.dispose();
      energy.dispose();
    };
  }, []);

  return <div ref={container} aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ transform: `translateY(${progress * 80}px) scale(${1 + progress * 0.12})` }} />;
}
