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

    // Mouse coordinates with smooth easing
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ========================================================
    // 3D SHOPPING ARTIFACTS BUILDERS (100% Shopping Related)
    // ========================================================

    // 1. Luxury Designer Shopping Bag (Handles, Tapered Box, Creases & Plaque)
    const buildShoppingBag = () => {
      const vertices = [
        // Top 4 opening rim vertices (0..3)
        { x: -0.7, y: 0.6, z: 0.38 },
        { x:  0.7, y: 0.6, z: 0.38 },
        { x:  0.7, y: 0.6, z: -0.38 },
        { x: -0.7, y: 0.6, z: -0.38 },

        // Bottom 4 base vertices (4..7)
        { x: -0.85, y: -0.8, z: 0.46 },
        { x:  0.85, y: -0.8, z: 0.46 },
        { x:  0.85, y: -0.8, z: -0.46 },
        { x: -0.85, y: -0.8, z: -0.46 },

        // Side tuck crease midpoints (8, 9)
        { x: -0.65, y: -0.1, z: 0.0 },
        { x:  0.65, y: -0.1, z: 0.0 },

        // Front Handle Arch (10..14)
        { x: -0.32, y: 0.6, z: 0.4 },
        { x: -0.28, y: 0.95, z: 0.4 },
        { x:  0.0,  y: 1.15, z: 0.4 },
        { x:  0.28, y: 0.95, z: 0.4 },
        { x:  0.32, y: 0.6, z: 0.4 },

        // Back Handle Arch (15..19)
        { x: -0.32, y: 0.6, z: -0.4 },
        { x: -0.28, y: 0.95, z: -0.4 },
        { x:  0.0,  y: 1.15, z: -0.4 },
        { x:  0.28, y: 0.95, z: -0.4 },
        { x:  0.32, y: 0.6, z: -0.4 },

        // Front ÉLANE Logo Plaque (20..23)
        { x: -0.3, y: 0.08, z: 0.44 },
        { x:  0.3, y: 0.08, z: 0.44 },
        { x:  0.3, y: -0.16, z: 0.44 },
        { x: -0.3, y: -0.16, z: 0.44 },
      ];

      const edges = [
        // Top opening
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Bottom base
        [4, 5], [5, 6], [6, 7], [7, 4],
        // Corner pillars
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Side folding creases
        [3, 8], [8, 0], [8, 4], [8, 7],
        [2, 9], [9, 1], [9, 5], [9, 6],
        // Front handle arch
        [10, 11], [11, 12], [12, 13], [13, 14],
        // Back handle arch
        [15, 16], [16, 17], [17, 18], [18, 19],
        // Emblem plaque
        [20, 21], [21, 22], [22, 23], [23, 20],
      ];

      return { vertices, edges };
    };

    // 2. 3D Shopping Cart / Trolley (Basket cage, Handlebar, Chassis, 4 Wheels)
    const buildShoppingCart = () => {
      const vertices = [
        // Basket top rim (0..3)
        { x: -0.55, y: 0.45, z: 0.45 },
        { x:  0.65, y: 0.4, z: 0.4 },
        { x:  0.65, y: 0.4, z: -0.4 },
        { x: -0.55, y: 0.45, z: -0.45 },

        // Basket bottom rim (4..7)
        { x: -0.45, y: -0.15, z: 0.35 },
        { x:  0.55, y: -0.12, z: 0.3 },
        { x:  0.55, y: -0.12, z: -0.3 },
        { x: -0.45, y: -0.15, z: -0.35 },

        // Handlebar uprights & crossbar (8..9)
        { x: -0.82, y: 0.75, z: 0.45 },
        { x: -0.82, y: 0.75, z: -0.45 },

        // Chassis frame (10..13)
        { x: -0.55, y: -0.48, z: 0.38 },
        { x:  0.55, y: -0.48, z: 0.34 },
        { x:  0.55, y: -0.48, z: -0.34 },
        { x: -0.55, y: -0.48, z: -0.38 },

        // 4 Wheel hub centers (14..17)
        { x: -0.5, y: -0.68, z: 0.38 },
        { x:  0.5, y: -0.68, z: 0.34 },
        { x:  0.5, y: -0.68, z: -0.34 },
        { x: -0.5, y: -0.68, z: -0.38 },
      ];

      const edges = [
        // Basket rims & posts
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Side wire reinforcement
        [0, 5], [3, 6],
        // Handlebar
        [0, 8], [3, 9], [8, 9],
        // Chassis & wheels
        [4, 10], [5, 11], [6, 12], [7, 13],
        [10, 11], [11, 12], [12, 13], [13, 10],
        [10, 14], [11, 15], [12, 16], [13, 17],
      ];

      return { vertices, edges, wheelIndices: [14, 15, 16, 17] };
    };

    // 3. 3D Wrapped Gift Box with Tied Ribbon & Bow Loops
    const buildGiftBox = () => {
      const s = 0.58;
      const vertices = [
        // Main box body (0..7)
        { x: -s, y:  s, z:  s },
        { x:  s, y:  s, z:  s },
        { x:  s, y: -s, z:  s },
        { x: -s, y: -s, z:  s },
        { x: -s, y:  s, z: -s },
        { x:  s, y:  s, z: -s },
        { x:  s, y: -s, z: -s },
        { x: -s, y: -s, z: -s },

        // Lid rim overhang (8..11)
        { x: -s * 1.08, y: s * 0.72, z:  s * 1.08 },
        { x:  s * 1.08, y: s * 0.72, z:  s * 1.08 },
        { x:  s * 1.08, y: s * 0.72, z: -s * 1.08 },
        { x: -s * 1.08, y: s * 0.72, z: -s * 1.08 },

        // Cross ribbon bands on lid (12..15)
        { x:  0, y: s * 1.02, z:  s },
        { x:  0, y: s * 1.02, z: -s },
        { x: -s, y: s * 1.02, z:  0 },
        { x:  s, y: s * 1.02, z:  0 },

        // Bow Loops on Top (16..22)
        { x:  0,     y: s * 1.02, z:  0 },    // 16: center knot
        { x: -0.32,  y: s * 1.48, z: -0.18 }, // 17: loop 1 top
        { x: -0.16,  y: s * 1.25, z: -0.32 }, // 18: loop 1 base
        { x:  0.32,  y: s * 1.48, z:  0.18 }, // 19: loop 2 top
        { x:  0.16,  y: s * 1.25, z:  0.32 }, // 20: loop 2 base
        { x: -0.25,  y: s * 1.15, z:  0.22 }, // 21: ribbon tail 1
        { x:  0.25,  y: s * 1.15, z: -0.22 }, // 22: ribbon tail 2
      ];

      const edges = [
        // Box 12 edges
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Lid rim
        [8, 9], [9, 10], [10, 11], [11, 8],
        // Cross ribbon
        [12, 13], [14, 15],
        // Bow loop 1
        [16, 17], [17, 18], [18, 16],
        // Bow loop 2
        [16, 19], [19, 20], [20, 16],
        // Ribbon tails
        [16, 21], [16, 22],
      ];

      return { vertices, edges };
    };

    // 4. 3D Boutique Designer Price / Authenticity Tag with String Cord
    const buildPriceTag = () => {
      const vertices = [
        // Bottom edge (0, 1)
        { x: -0.45, y: -0.85, z: 0.02 },
        { x:  0.45, y: -0.85, z: 0.02 },
        // Sides (2, 3)
        { x:  0.45, y:  0.45, z: 0.02 },
        { x: -0.45, y:  0.45, z: 0.02 },
        // Clipped angled shoulders (4, 5)
        { x:  0.22, y:  0.8, z: 0.02 },
        { x: -0.22, y:  0.8, z: 0.02 },

        // Eyelet grommet center (6)
        { x: 0, y: 0.68, z: 0.02 },

        // Curving String Cord (7..10)
        { x: 0, y: 0.8, z: 0.02 },
        { x: -0.15, y: 1.15, z: 0.18 },
        { x:  0.12, y: 1.48, z: -0.12 },
        { x: -0.05, y: 1.8, z: 0.05 },

        // Barcode / Price Detail Lines (11..16)
        { x: -0.32, y: -0.15, z: 0.03 }, { x: 0.32, y: -0.15, z: 0.03 },
        { x: -0.32, y: -0.35, z: 0.03 }, { x: 0.32, y: -0.35, z: 0.03 },
        { x: -0.32, y: -0.55, z: 0.03 }, { x: 0.32, y: -0.55, z: 0.03 },
      ];

      const edges = [
        // Tag perimeter
        [0, 1], [1, 2], [2, 4], [4, 5], [5, 3], [3, 0],
        // Cord string
        [6, 7], [7, 8], [8, 9], [9, 10],
        // Barcode lines
        [11, 12], [13, 14], [15, 16],
      ];

      return { vertices, edges, eyeletIndex: 6 };
    };

    // 5. 3D VIP Luxury Shopping Card with EMV Smart Chip
    const buildShoppingCard = () => {
      const vertices = [
        // Front face (0..3)
        { x: -0.85, y:  0.52, z: 0.02 },
        { x:  0.85, y:  0.52, z: 0.02 },
        { x:  0.85, y: -0.52, z: 0.02 },
        { x: -0.85, y: -0.52, z: 0.02 },

        // Back face (4..7)
        { x: -0.85, y:  0.52, z: -0.02 },
        { x:  0.85, y:  0.52, z: -0.02 },
        { x:  0.85, y: -0.52, z: -0.02 },
        { x: -0.85, y: -0.52, z: -0.02 },

        // EMV Smart Chip (8..11)
        { x: -0.55, y:  0.15, z: 0.035 },
        { x: -0.25, y:  0.15, z: 0.035 },
        { x: -0.25, y: -0.15, z: 0.035 },
        { x: -0.55, y: -0.15, z: 0.035 },

        // Magnetic Strip on back (12..15)
        { x: -0.85, y:  0.25, z: -0.03 },
        { x:  0.85, y:  0.25, z: -0.03 },
        { x:  0.85, y:  0.05, z: -0.03 },
        { x: -0.85, y:  0.05, z: -0.03 },
      ];

      const edges = [
        // Front perimeter
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Back perimeter
        [4, 5], [5, 6], [6, 7], [7, 4],
        // Corner thickness
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Chip
        [8, 9], [9, 10], [10, 11], [11, 8],
        // Magnetic Strip
        [12, 13], [14, 15],
      ];

      return { vertices, edges };
    };

    const models = {
      shopping_bag: buildShoppingBag(),
      shopping_cart: buildShoppingCart(),
      gift_box: buildGiftBox(),
      price_tag: buildPriceTag(),
      shopping_card: buildShoppingCard(),
    };

    // 5 Shopping Artifacts Placed Harmoniously Across Viewport
    const shoppingArtifacts = [
      {
        modelKey: 'shopping_bag',
        x: width * 0.14,
        y: height * 0.24,
        size: 42,
        rotX: 0.25,
        rotY: 0.45,
        speedX: 0.004,
        speedY: 0.007,
        accentColor: '#2563EB', // Royal Sapphire
        label: 'ATELIER BAG',
      },
      {
        modelKey: 'gift_box',
        x: width * 0.86,
        y: height * 0.28,
        size: 38,
        rotX: -0.35,
        rotY: 0.5,
        speedX: -0.005,
        speedY: 0.006,
        accentColor: '#E11D48', // Ruby Gift Box
        label: 'ROYAL PARCEL',
      },
      {
        modelKey: 'shopping_cart',
        x: width * 0.16,
        y: height * 0.78,
        size: 40,
        rotX: 0.2,
        rotY: -0.5,
        speedX: 0.005,
        speedY: -0.004,
        accentColor: '#D4AF37', // 24K Gold Trolley
        label: 'LUXURY CART',
      },
      {
        modelKey: 'price_tag',
        x: width * 0.85,
        y: height * 0.76,
        size: 36,
        rotX: -0.4,
        rotY: -0.3,
        speedX: -0.004,
        speedY: -0.006,
        accentColor: '#D97706', // Amber Tag
        label: 'DESIGNER TAG',
      },
      {
        modelKey: 'shopping_card',
        x: width * 0.5,
        y: height * 0.86,
        size: 32,
        rotX: 0.45,
        rotY: 0.2,
        speedX: 0.006,
        speedY: 0.005,
        accentColor: '#059669', // Emerald VIP Card
        label: 'VIP PRIVILEGE',
      },
    ];

    // ========================================================
    // FLOATING SHOPPING CONFETTI & STARDUST
    // ========================================================
    const PARTICLE_COUNT = 52;
    const particles = [];
    const shoppingPalette = ['#D4AF37', '#F59E0B', '#2563EB', '#E11D48', '#059669', '#FCD34D'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 550 + 50,
        radius: Math.random() * 2.0 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.4,
        color: shoppingPalette[Math.floor(Math.random() * shoppingPalette.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        isGlint: Math.random() > 0.65,
      });
    }

    // Helper: Draw 4-point Royal Sparkle Glint (✦)
    const drawGlint = (cx, cy, radius, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = isDark ? 8 : 4;

      ctx.beginPath();
      const points = 4;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? radius : radius * 0.22;
        const theta = (i * Math.PI) / points;
        const sx = cx + Math.cos(theta) * r;
        const sy = cy + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let time = 0;

    // ========================================================
    // RENDER LOOP
    // ========================================================
    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const mouseNormX = (mouse.x / width - 0.5) * 32;
      const mouseNormY = (mouse.y / height - 0.5) * 32;
      const fov = 400;

      // 1. Draw Floating Confetti / Stardust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < 20) p.z = 600;
        if (p.z > 600) p.z = 20;

        const scale = fov / (fov + p.z);
        const projX = (p.x - width / 2 + mouseNormX * scale) * scale + width / 2;
        const projY = (p.y - height / 2 + mouseNormY * scale) * scale + height / 2;

        const dynamicAlpha = (0.35 + Math.sin(p.pulse) * 0.25) * scale;

        if (p.isGlint) {
          drawGlint(projX, projY, (p.radius * 3.5 + 2) * scale, p.color, dynamicAlpha * 1.1);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.6, p.radius * scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = dynamicAlpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = isDark ? 6 * scale : 3 * scale;
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Draw 3D Shopping Artifacts (Bag, Cart, Gift Box, Price Tag, Card)
      shoppingArtifacts.forEach((art, idx) => {
        art.rotX += art.speedX;
        art.rotY += art.speedY;

        const cosX = Math.cos(art.rotX);
        const sinX = Math.sin(art.rotX);
        const cosY = Math.cos(art.rotY);
        const sinY = Math.sin(art.rotY);

        const cx = art.x + mouseNormX * 0.5 + Math.sin(time + idx * 1.4) * 12;
        const cy = art.y + mouseNormY * 0.5 + Math.cos(time + idx * 1.4) * 12;

        const model = models[art.modelKey];
        if (!model) return;

        // 3D Matrix Rotation & Perspective Projection
        const projected = model.vertices.map((v) => {
          // Rotate Y
          const x1 = v.x * cosY - v.z * sinY;
          const z1 = v.x * sinY + v.z * cosY;
          // Rotate X
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = v.y * sinX + z1 * cosX;

          const depthScale = 1 / (1 + z2 * 0.22);
          return {
            x: cx + x1 * art.size * depthScale,
            y: cy + y2 * art.size * depthScale,
            z: z2,
          };
        });

        ctx.save();

        // Subtle Ambient Halo behind shopping structure
        const haloGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, art.size * 1.2);
        haloGrad.addColorStop(0, isDark ? 'rgba(212, 175, 55, 0.18)' : 'rgba(217, 119, 6, 0.12)');
        haloGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, art.size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Draw 3D Edges
        ctx.lineWidth = 1.15;
        model.edges.forEach(([from, to]) => {
          const pA = projected[from];
          const pB = projected[to];
          if (!pA || !pB) return;

          const avgZ = (pA.z + pB.z) / 2;
          const baseAlpha = isDark ? 0.35 + (avgZ + 1) * 0.12 : 0.24 + (avgZ + 1) * 0.08;

          ctx.strokeStyle = isDark
            ? `rgba(245, 158, 11, ${baseAlpha})`
            : `rgba(217, 119, 6, ${baseAlpha})`;

          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        });

        // Extra details for Shopping Cart: 4 Circular Wheels
        if (art.modelKey === 'shopping_cart' && model.wheelIndices) {
          model.wheelIndices.forEach((wIdx) => {
            const wp = projected[wIdx];
            if (!wp) return;
            ctx.beginPath();
            ctx.arc(wp.x, wp.y, 4.5, 0, Math.PI * 2);
            ctx.strokeStyle = isDark ? '#FCD34D' : '#D97706';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });
        }

        // Extra details for Price Tag: Eyelet Grommet
        if (art.modelKey === 'price_tag' && model.eyeletIndex !== undefined) {
          const ep = projected[model.eyeletIndex];
          if (ep) {
            ctx.beginPath();
            ctx.arc(ep.x, ep.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#FCD34D' : '#D97706';
            ctx.fill();
          }
        }

        // Central Sparkle Accent
        const sparkleSize = 5 + Math.sin(time * 3 + idx) * 2;
        drawGlint(cx, cy, sparkleSize, isDark ? '#FDE68A' : '#D97706', 0.85);

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
      className="fixed inset-0 pointer-events-none z-10 opacity-80 dark:opacity-90 transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
}
