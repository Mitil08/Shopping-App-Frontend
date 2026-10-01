import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Global3DCanvas() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates with easing
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Particles / Constellation Grid
    const PARTICLE_COUNT = 65;
    const particles = [];

    // Tech, horology, and luxury jewel tones
    const goldPalette = ['#D4AF37', '#E5C06A', '#C5A059', '#9E743A', '#64B5F6', '#BA68C8'];
    const darkPalette = ['#C5A059', '#9E743A', '#38BDF8', '#818CF8', '#F472B6', '#E2E8F0'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 600 + 50, // 3D depth
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.5,
        color: (isDark ? darkPalette : goldPalette)[Math.floor(Math.random() * 6)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        ringRadius: 10 + Math.random() * 25,
        hasRing: Math.random() > 0.65, // Quantum orbit rings
        tilt: Math.random() * Math.PI,
      });
    }

    // Floating 3D Geometric Polyhedra nodes (representing tech & craft vertices)
    const geometricNodes = [
      { x: width * 0.15, y: height * 0.25, rotX: 0, rotY: 0, size: 45, speedX: 0.004, speedY: 0.006 },
      { x: width * 0.85, y: height * 0.35, rotX: 0, rotY: 0, size: 55, speedX: -0.005, speedY: 0.004 },
      { x: width * 0.25, y: height * 0.75, rotX: 0, rotY: 0, size: 40, speedX: 0.003, speedY: -0.005 },
      { x: width * 0.8, y: height * 0.8, rotX: 0, rotY: 0, size: 50, speedX: -0.004, speedY: -0.003 },
    ];

    // Octahedron 3D vertices
    const baseOctahedron = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 },
    ];

    const octaEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseNormX = (mouse.x / width - 0.5) * 40;
      const mouseNormY = (mouse.y / height - 0.5) * 40;

      // 1. Draw connecting constellation lines with distance falloff
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // 3D perspective projection factor
        const fov = 400;
        const scale1 = fov / (fov + p1.z);
        const projX1 = (p1.x - width / 2 + mouseNormX * scale1) * scale1 + width / 2;
        const projY1 = (p1.y - height / 2 + mouseNormY * scale1) * scale1 + height / 2;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = fov / (fov + p2.z);
          const projX2 = (p2.x - width / 2 + mouseNormX * scale2) * scale2 + width / 2;
          const projY2 = (p2.y - height / 2 + mouseNormY * scale2) * scale2 + height / 2;

          const dx = projX1 - projX2;
          const dy = projY1 - projY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18 * scale1;
            ctx.strokeStyle = isDark ? `rgba(194, 166, 118, ${alpha})` : `rgba(168, 140, 90, ${alpha * 0.85})`;
            ctx.lineWidth = 0.75 * scale1;
            ctx.beginPath();
            ctx.moveTo(projX1, projY1);
            ctx.lineTo(projX2, projY2);
            ctx.stroke();
          }
        }
      }

      // 2. Draw 3D Floating Particles & Orbit Rings
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulse += p.pulseSpeed;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < 20) p.z = 600;
        if (p.z > 600) p.z = 20;

        const fov = 400;
        const scale = fov / (fov + p.z);
        const projX = (p.x - width / 2 + mouseNormX * scale) * scale + width / 2;
        const projY = (p.y - height / 2 + mouseNormY * scale) * scale + height / 2;

        const dynamicRadius = p.radius * scale * (1 + Math.sin(p.pulse) * 0.2);

        // Core Particle Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.5, dynamicRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5 * scale + (Math.sin(p.pulse) + 1) * 0.25;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isDark ? 8 * scale : 4 * scale;
        ctx.fill();
        ctx.restore();

        // Optional Quantum Orbit Ring around key nodes
        if (p.hasRing) {
          ctx.save();
          ctx.beginPath();
          const rRadius = p.ringRadius * scale;
          ctx.ellipse(
            projX,
            projY,
            rRadius,
            rRadius * 0.35,
            p.tilt + time * 0.3,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.14 * scale;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Draw 3D Rotating Octahedral Wireframes (Luxury Tech Crystals)
      geometricNodes.forEach((node, nodeIdx) => {
        node.rotX += node.speedX;
        node.rotY += node.speedY;

        const cosX = Math.cos(node.rotX);
        const sinX = Math.sin(node.rotX);
        const cosY = Math.cos(node.rotY);
        const sinY = Math.sin(node.rotY);

        const cx = node.x + mouseNormX * 0.5 + Math.sin(time + nodeIdx) * 12;
        const cy = node.y + mouseNormY * 0.5 + Math.cos(time + nodeIdx) * 12;

        const projected = baseOctahedron.map((v) => {
          // Rotate Y
          let x1 = v.x * cosY - v.z * sinY;
          let z1 = v.x * sinY + v.z * cosY;
          // Rotate X
          let y2 = v.y * cosX - z1 * sinX;
          let z2 = v.y * sinX + z1 * cosX;

          const depthScale = 1 / (1 + z2 * 0.25);
          return {
            x: cx + x1 * node.size * depthScale,
            y: cy + y2 * node.size * depthScale,
            z: z2,
          };
        });

        // Draw edges
        ctx.save();
        ctx.lineWidth = 0.85;
        octaEdges.forEach(([from, to]) => {
          const pA = projected[from];
          const pB = projected[to];
          const avgZ = (pA.z + pB.z) / 2;
          const alpha = isDark ? 0.16 + (avgZ + 1) * 0.08 : 0.11 + (avgZ + 1) * 0.05;

          ctx.strokeStyle = isDark ? `rgba(212, 175, 55, ${alpha})` : `rgba(180, 140, 70, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        });

        // Center jewel pulse
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#E5C06A' : '#C2A676';
        ctx.globalAlpha = 0.35 + Math.sin(time * 2 + nodeIdx) * 0.2;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-75 dark:opacity-85 transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
}
