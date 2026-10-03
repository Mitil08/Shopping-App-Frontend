import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function Hero3DScene() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Luxury Lighting Setup (Warm Gold & Cool Specular Highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xfcd34d, 3.2);
    goldKeyLight.position.set(10, 12, 14);
    scene.add(goldKeyLight);

    const roseFillLight = new THREE.PointLight(0xf43f5e, 2.8, 45);
    roseFillLight.position.set(-12, -6, 10);
    scene.add(roseFillLight);

    const cyanRimLight = new THREE.PointLight(0x38bdf8, 2.5, 45);
    cyanRimLight.position.set(8, -10, -8);
    scene.add(cyanRimLight);

    const topGlowLight = new THREE.PointLight(0xd4af37, 2.0, 35);
    topGlowLight.position.set(0, 10, 5);
    scene.add(topGlowLight);

    // 3. Central Shopping Stage Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // ==========================================
    // A. CENTRAL 3D LUXURY SHOPPING BAG
    // ==========================================
    const bagGroup = new THREE.Group();
    stageGroup.add(bagGroup);

    // Common Luxury Materials
    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x926c15,
      emissiveIntensity: 0.25,
    });

    const bagLeatherMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x1d4ed8 : 0x2563eb, // Royal Sapphire Silk Blue (NO black)
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.95,
      clearcoatRoughness: 0.15,
      reflectivity: 0.95,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xd4af37), // Golden luxury sheen
    });

    const interiorShadowMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x1e293b : 0x334155, // Deep Slate Navy, never black
    });

    // 1. Bag Body (Tapered trapezoid box for architectural luxury look)
    const bagWidthTop = 3.6;
    const bagWidthBottom = 4.2;
    const bagHeight = 4.6;
    const bagDepth = 2.4;

    // Use cylinder or custom box for tapered look
    const bagGeo = new THREE.BoxGeometry(bagWidthBottom, bagHeight, bagDepth, 4, 4, 4);
    // Subtle taper towards top vertices
    const posAttr = bagGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const factor = (y + bagHeight / 2) / bagHeight; // 0 at bottom, 1 at top
      const scaleX = 1 - factor * 0.12; // slightly narrower top
      const scaleZ = 1 - factor * 0.08;
      posAttr.setX(i, posAttr.getX(i) * scaleX);
      posAttr.setZ(i, posAttr.getZ(i) * scaleZ);
    }
    bagGeo.computeVertexNormals();

    const bagMesh = new THREE.Mesh(bagGeo, bagLeatherMat);
    bagMesh.castShadow = true;
    bagGroup.add(bagMesh);

    // Decorative top rim band
    const rimGeo = new THREE.BoxGeometry(bagWidthTop + 0.12, 0.18, bagDepth * 0.94);
    const rimMesh = new THREE.Mesh(rimGeo, goldMetalMat);
    rimMesh.position.y = bagHeight / 2;
    bagGroup.add(rimMesh);

    // Inner void illusion
    const innerGeo = new THREE.BoxGeometry(bagWidthTop - 0.2, 0.05, bagDepth * 0.88);
    const innerMesh = new THREE.Mesh(innerGeo, interiorShadowMat);
    innerMesh.position.y = bagHeight / 2 + 0.02;
    bagGroup.add(innerMesh);

    // Tissue paper peeking out of bag
    const tissueGeo = new THREE.ConeGeometry(0.9, 1.2, 5);
    const tissueMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xf5eedb : 0xe8e4dc,
      roughness: 0.8,
      metalness: 0.1,
    });
    const tissue1 = new THREE.Mesh(tissueGeo, tissueMat);
    tissue1.position.set(-0.6, bagHeight / 2 + 0.5, 0);
    tissue1.rotation.set(-0.2, 0.3, 0.35);
    bagGroup.add(tissue1);

    const tissue2 = new THREE.Mesh(tissueGeo, tissueMat);
    tissue2.position.set(0.6, bagHeight / 2 + 0.45, 0.1);
    tissue2.rotation.set(0.1, -0.4, -0.3);
    bagGroup.add(tissue2);

    // 2. Arched Tubular Handles (Front and Back)
    const handleRadius = 1.05;
    const handleTube = 0.07;
    const handleGeo = new THREE.TorusGeometry(handleRadius, handleTube, 16, 48, Math.PI);

    // Front Handle
    const frontHandle = new THREE.Mesh(handleGeo, goldMetalMat);
    frontHandle.position.set(0, bagHeight / 2, bagDepth / 2 - 0.12);
    frontHandle.rotation.x = 0; // arch points UP
    bagGroup.add(frontHandle);

    // Back Handle
    const backHandle = new THREE.Mesh(handleGeo, goldMetalMat);
    backHandle.position.set(0, bagHeight / 2, -bagDepth / 2 + 0.12);
    backHandle.rotation.x = 0;
    bagGroup.add(backHandle);

    // 3. Gold Handle Eyelet Grommets (4 anchors)
    const eyeletGeo = new THREE.TorusGeometry(0.16, 0.045, 12, 24);
    const eyeletOffsets = [
      [-handleRadius, bagHeight / 2, bagDepth / 2 - 0.08],
      [handleRadius, bagHeight / 2, bagDepth / 2 - 0.08],
      [-handleRadius, bagHeight / 2, -bagDepth / 2 + 0.08],
      [handleRadius, bagHeight / 2, -bagDepth / 2 + 0.08],
    ];

    eyeletOffsets.forEach(([x, y, z]) => {
      const eyelet = new THREE.Mesh(eyeletGeo, goldMetalMat);
      eyelet.position.set(x, y, z);
      eyelet.rotation.x = Math.PI / 2;
      bagGroup.add(eyelet);
    });

    // 4. ÉLANE Gold Emblem Plaque on front face
    const emblemGeo = new THREE.BoxGeometry(1.4, 0.45, 0.06);
    const emblemMesh = new THREE.Mesh(emblemGeo, goldMetalMat);
    emblemMesh.position.set(0, 0.35, bagDepth / 2 + 0.02);
    bagGroup.add(emblemMesh);

    // 5. Hanging Designer Price / Authenticity Tag
    const tagCordGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.4, 8);
    const tagCordMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const tagCord = new THREE.Mesh(tagCordGeo, tagCordMat);
    tagCord.position.set(handleRadius - 0.15, bagHeight / 2 - 0.5, bagDepth / 2 + 0.1);
    tagCord.rotation.z = -0.35;
    bagGroup.add(tagCord);

    const tagCardGeo = new THREE.BoxGeometry(0.75, 1.15, 0.03);
    const tagCardMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c, // Royal Ruby Crimson (NO black)
      roughness: 0.25,
      metalness: 0.35,
    });
    const tagCard = new THREE.Mesh(tagCardGeo, tagCardMat);
    tagCard.position.set(handleRadius + 0.2, bagHeight / 2 - 1.25, bagDepth / 2 + 0.18);
    tagCard.rotation.set(0.1, -0.2, -0.3);
    bagGroup.add(tagCard);

    // Small Gold Grommet on Tag
    const tagGrommetGeo = new THREE.TorusGeometry(0.08, 0.025, 8, 16);
    const tagGrommet = new THREE.Mesh(tagGrommetGeo, goldMetalMat);
    tagGrommet.position.set(handleRadius + 0.08, bagHeight / 2 - 0.8, bagDepth / 2 + 0.2);
    bagGroup.add(tagGrommet);

    // ==========================================
    // B. ORBITING SHOPPING ITEMS
    // ==========================================
    const orbitingItems = [];

    // Helper: Create a Luxury Gift Box with Tied Ribbon
    const createGiftBox = (size, boxColor, ribbonColor) => {
      const gGroup = new THREE.Group();
      const bGeo = new THREE.BoxGeometry(size, size, size);
      const bMat = new THREE.MeshStandardMaterial({
        color: boxColor,
        roughness: 0.25,
        metalness: 0.3,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      gGroup.add(bMesh);

      // Ribbon Band 1 (Horizontal)
      const rMat = new THREE.MeshStandardMaterial({
        color: ribbonColor,
        metalness: 0.85,
        roughness: 0.2,
        emissive: ribbonColor,
        emissiveIntensity: 0.2,
      });
      const r1Geo = new THREE.BoxGeometry(size * 1.02, size * 0.22, size * 1.02);
      const r1Mesh = new THREE.Mesh(r1Geo, rMat);
      gGroup.add(r1Mesh);

      // Ribbon Band 2 (Vertical cross)
      const r2Geo = new THREE.BoxGeometry(size * 0.22, size * 1.02, size * 1.02);
      const r2Mesh = new THREE.Mesh(r2Geo, rMat);
      gGroup.add(r2Mesh);

      // Ribbon Bow on top
      const bowGeo1 = new THREE.TorusGeometry(size * 0.22, size * 0.06, 12, 24);
      const bow1 = new THREE.Mesh(bowGeo1, rMat);
      bow1.position.set(-size * 0.15, size / 2 + size * 0.15, 0);
      bow1.rotation.set(0, Math.PI / 4, Math.PI / 4);
      gGroup.add(bow1);

      const bow2 = new THREE.Mesh(bowGeo1, rMat);
      bow2.position.set(size * 0.15, size / 2 + size * 0.15, 0);
      bow2.rotation.set(0, -Math.PI / 4, -Math.PI / 4);
      gGroup.add(bow2);

      return gGroup;
    };

    // 1. Ruby & Gold Gift Box
    const giftBox1 = createGiftBox(1.3, 0x9f1239, 0xfcd34d);
    scene.add(giftBox1);
    orbitingItems.push({
      mesh: giftBox1,
      radius: 6.8,
      speed: 0.007,
      angle: 0.4,
      yOffset: 1.8,
      rotSpeed: { x: 0.01, y: 0.015, z: 0.005 },
    });

    // 2. Emerald & Champagne Gift Box
    const giftBox2 = createGiftBox(1.0, 0x064e3b, 0xfef08a);
    scene.add(giftBox2);
    orbitingItems.push({
      mesh: giftBox2,
      radius: 6.2,
      speed: -0.006,
      angle: 2.8,
      yOffset: -1.6,
      rotSpeed: { x: 0.012, y: -0.01, z: 0.008 },
    });

    // 3. Holographic VIP Platinum Shopping Card
    const cardGroup = new THREE.Group();
    const cardBaseGeo = new THREE.BoxGeometry(1.8, 1.1, 0.04);
    const cardBaseMat = new THREE.MeshPhysicalMaterial({
      color: 0x4338ca, // Holographic Royal Amethyst (NO black)
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      reflectivity: 1.0,
    });
    const cardMesh = new THREE.Mesh(cardBaseGeo, cardBaseMat);
    cardGroup.add(cardMesh);

    // Gold Chip
    const chipGeo = new THREE.BoxGeometry(0.38, 0.3, 0.05);
    const chipMesh = new THREE.Mesh(chipGeo, goldMetalMat);
    chipMesh.position.set(-0.5, 0.1, 0.01);
    cardGroup.add(chipMesh);

    // Magnetic Holographic Strip
    const magGeo = new THREE.BoxGeometry(1.82, 0.2, 0.045);
    const magMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const magMesh = new THREE.Mesh(magGeo, magMat);
    magMesh.position.set(0, -0.25, 0.005);
    cardGroup.add(magMesh);

    scene.add(cardGroup);
    orbitingItems.push({
      mesh: cardGroup,
      radius: 7.2,
      speed: 0.0055,
      angle: 1.8,
      yOffset: 0.8,
      rotSpeed: { x: 0.008, y: 0.02, z: 0.005 },
    });

    // 4. Bespoke Royal 24K Gold Shopping Trolley
    const cartGroup = new THREE.Group();
    // Gleaming solid gold architectural basket frame
    const basketGeo = new THREE.BoxGeometry(1.5, 1.1, 1.1);
    const basketLuxeMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 0.9,
      reflectivity: 1.0,
      emissive: 0x8a6d1a,
      emissiveIntensity: 0.2,
    });
    const basketMesh = new THREE.Mesh(basketGeo, basketLuxeMat);
    cartGroup.add(basketMesh);

    // Gold Tubular Rim
    const cartRimGeo = new THREE.BoxGeometry(1.6, 0.08, 1.2);
    const cartRim = new THREE.Mesh(cartRimGeo, goldMetalMat);
    cartRim.position.y = 0.55;
    cartGroup.add(cartRim);

    // Handle bar
    const cartHandleGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.1, 12);
    const cartHandleMesh = new THREE.Mesh(cartHandleGeo, goldMetalMat);
    cartHandleMesh.position.set(-0.88, 0.65, 0);
    cartHandleMesh.rotation.x = Math.PI / 2;
    cartGroup.add(cartHandleMesh);

    // 4 Polished Royal Chrome Wheels
    const wheelGeo = new THREE.TorusGeometry(0.18, 0.05, 12, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const wheelPositions = [
      [-0.55, -0.65, 0.55],
      [0.55, -0.65, 0.55],
      [-0.55, -0.65, -0.55],
      [0.55, -0.65, -0.55],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.rotation.y = Math.PI / 2;
      cartGroup.add(wheel);
    });

    scene.add(cartGroup);
    orbitingItems.push({
      mesh: cartGroup,
      radius: 8.0,
      speed: -0.0045,
      angle: 4.2,
      yOffset: -1.2,
      rotSpeed: { x: 0.005, y: 0.015, z: 0.008 },
    });

    // 5. Floating Royal Faceted Solitaires & 24K Gold Coin Medallions
    const sealGeos = [
      new THREE.IcosahedronGeometry(0.55, 0), // Faceted Solitaire Jewel
      new THREE.CylinderGeometry(0.48, 0.48, 0.12, 16), // 24K Gold Medallion
      new THREE.CylinderGeometry(0.28, 0.28, 0.95, 16), // Crystal Perfume Flacon
    ];

    const sealColors = [0xf59e0b, 0xec4899, 0x10b981];

    for (let i = 0; i < 6; i++) {
      const sGeo = sealGeos[i % sealGeos.length];
      const sMat = new THREE.MeshPhysicalMaterial({
        color: sealColors[i % sealColors.length],
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 1.0,
        reflectivity: 1.0,
        emissive: sealColors[i % sealColors.length],
        emissiveIntensity: 0.3,
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.castShadow = true;

      scene.add(sMesh);
      orbitingItems.push({
        mesh: sMesh,
        radius: 5.5 + (i * 0.8),
        speed: (0.004 + (i * 0.001)) * (i % 2 === 0 ? 1 : -1),
        angle: (i * Math.PI) / 3,
        yOffset: ((i % 3) - 1) * 2.2,
        rotSpeed: { x: 0.015 + (i * 0.003), y: 0.02, z: 0.01 },
      });
    }

    // ==========================================
    // C. SWIRLING SHOPPING CONFETTI & GOLDEN DUST
    // ==========================================
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const goldCol = new THREE.Color(0xd4af37);
    const roseCol = new THREE.Color(0xf43f5e);
    const cyanCol = new THREE.Color(0x38bdf8);
    const whiteCol = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 44;
      const y = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 32;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const rand = Math.random();
      const col = rand > 0.6 ? goldCol : rand > 0.35 ? roseCol : rand > 0.15 ? cyanCol : whiteCol;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ==========================================
    // D. MOUSE PARALLAX & ANIMATION LOOP
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.0006;
      targetY = (e.clientY - windowHalfY) * 0.0006;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera / stage parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Central Shopping Bag floating & gentle swaying
      bagGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.35;
      bagGroup.rotation.y = Math.sin(elapsedTime * 0.45) * 0.28 + mouseX * 2.2;
      bagGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.08 + mouseY * 1.6;
      bagGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.05;

      // Animate orbiting shopping items (Gift Boxes, VIP Card, Shopping Cart, Coins)
      orbitingItems.forEach((item) => {
        item.angle += item.speed;
        item.mesh.position.x = Math.cos(item.angle) * item.radius;
        item.mesh.position.z = Math.sin(item.angle) * item.radius;
        item.mesh.position.y = item.yOffset + Math.sin(elapsedTime * 1.5 + item.angle) * 0.35;

        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;
      });

      // Gentle stardust rotation
      particleSystem.rotation.y = -elapsedTime * 0.025;
      particleSystem.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 opacity-90 dark:opacity-100"
    />
  );
}
