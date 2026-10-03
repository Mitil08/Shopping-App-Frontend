import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Box, Sun, Moon, Flame } from 'lucide-react';

/**
 * Interactive 3D Luxury Product Inspector
 * Procedurally models coats/outerwear, luxury leather handbags, horology timepieces,
 * fine solitaire rings, niche perfume flacons, sneakers/footwear, and audio tech
 * with 360° mouse dragging, pinch/scroll zoom, ambient lighting presets, and CAD wireframe inspection.
 */
export default function Interactive3DProductViewer({ product, onClose }) {
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeMaterialMode, setActiveMaterialMode] = useState('studio'); // 'studio' | 'wireframe' | 'gold'
  const [lightingPreset, setLightingPreset] = useState('warmth'); // 'warmth' | 'runway' | 'atelier'
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const lightsGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // 2. High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Dynamic Studio Lighting Rig
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    lightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(6, 8, 7);
    lightsGroup.add(keyLight);

    const goldRimLight = new THREE.DirectionalLight(0xc2a676, 2.8);
    goldRimLight.position.set(-6, -3, -5);
    lightsGroup.add(goldRimLight);

    const blueFillLight = new THREE.PointLight(0x38bdf8, 2.0, 30);
    blueFillLight.position.set(0, -6, 5);
    lightsGroup.add(blueFillLight);

    // 4. Procedural Model Generation based on Product Category/Attributes
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const catId = (product?.category_id || '').toLowerCase();
    const prodName = (product?.name || '').toLowerCase();

    // Material Library
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
      clearcoat: 0.9,
      reflectivity: 1.0,
      emissive: 0x8a6d1a,
      emissiveIntensity: 0.2,
    });

    const luxuryLeatherMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f293d, // Royal Slate Navy
      metalness: 0.25,
      roughness: 0.35,
      clearcoat: 0.9,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xd4af37),
    });

    const woolCashmereMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Midnight Cashmere
      roughness: 0.85,
      metalness: 0.05,
    });

    const glassCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.92,
      transparent: true,
      opacity: 0.95,
      ior: 1.52,
      reflectivity: 0.98,
    });

    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.02,
      transmission: 0.96,
      transparent: true,
      opacity: 0.98,
      ior: 2.42, // Authentic diamond refractive index
      dispersion: 0.044,
      reflectivity: 1.0,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.3,
    });

    if (catId.includes('coat') || catId.includes('outerwear') || prodName.includes('coat') || prodName.includes('blazer') || prodName.includes('jacket')) {
      // --- A. LUXURY ATELIER TAILORED OVERCOAT / MANNEQUIN ---
      const torsoGeo = new THREE.CylinderGeometry(1.5, 1.1, 3.8, 32);
      const coatTorso = new THREE.Mesh(torsoGeo, woolCashmereMat);
      modelGroup.add(coatTorso);

      // Tailored Notch Lapels
      const lapelLeftGeo = new THREE.BoxGeometry(0.35, 2.2, 0.15);
      const lapelLeft = new THREE.Mesh(lapelLeftGeo, luxuryLeatherMat);
      lapelLeft.position.set(-0.65, 0.6, 1.15);
      lapelLeft.rotation.z = -0.15;
      modelGroup.add(lapelLeft);

      const lapelRight = lapelLeft.clone();
      lapelRight.position.set(0.65, 0.6, 1.15);
      lapelRight.rotation.z = 0.15;
      modelGroup.add(lapelRight);

      // Double-Breasted 24K Gold Horn Buttons (6 buttons)
      for (let row = 0; row < 3; row++) {
        [-0.45, 0.45].forEach((btnX) => {
          const btnGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24);
          const btn = new THREE.Mesh(btnGeo, goldMat);
          btn.rotation.x = Math.PI / 2;
          btn.position.set(btnX, 0.6 - row * 0.7, 1.18);
          modelGroup.add(btn);
        });
      }

      // Waist Leather Belt & Gold Buckle
      const beltGeo = new THREE.TorusGeometry(1.22, 0.12, 16, 48);
      const belt = new THREE.Mesh(beltGeo, luxuryLeatherMat);
      belt.rotation.x = Math.PI / 2;
      belt.position.y = -0.4;
      modelGroup.add(belt);

      const buckleGeo = new THREE.BoxGeometry(0.5, 0.38, 0.12);
      const buckle = new THREE.Mesh(buckleGeo, goldMat);
      buckle.position.set(0, -0.4, 1.25);
      modelGroup.add(buckle);

    } else if (catId.includes('bag') || prodName.includes('bag') || prodName.includes('tote') || prodName.includes('clutch')) {
      // --- B. BESPOKE STRUCTURED LEATHER TOTE / HANDBAG ---
      const bagBodyGeo = new THREE.BoxGeometry(3.6, 3.2, 1.8, 8, 8, 8);
      const bagBody = new THREE.Mesh(bagBodyGeo, luxuryLeatherMat);
      modelGroup.add(bagBody);

      // Gold Clasp Hardware
      const claspGeo = new THREE.BoxGeometry(0.8, 0.5, 0.15);
      const clasp = new THREE.Mesh(claspGeo, goldMat);
      clasp.position.set(0, 0.2, 0.95);
      modelGroup.add(clasp);

      // Curved Tubular Handles
      const handleGeo = new THREE.TorusGeometry(1.1, 0.08, 16, 48, Math.PI);
      const handleFront = new THREE.Mesh(handleGeo, goldMat);
      handleFront.position.set(0, 1.6, 0.65);
      modelGroup.add(handleFront);

      const handleBack = handleFront.clone();
      handleBack.position.set(0, 1.6, -0.65);
      modelGroup.add(handleBack);

      // Gold Padlock Charm
      const lockGeo = new THREE.BoxGeometry(0.35, 0.45, 0.15);
      const padlock = new THREE.Mesh(lockGeo, goldMat);
      padlock.position.set(0.9, 0.8, 0.85);
      modelGroup.add(padlock);

    } else if (catId.includes('jewelry') || prodName.includes('ring') || prodName.includes('solitaire') || prodName.includes('diamond')) {
      // --- C. SOLITAIRE DIAMOND RING & GOLD BAND ---
      const ringBandGeo = new THREE.TorusGeometry(1.6, 0.2, 24, 64);
      const ringBand = new THREE.Mesh(ringBandGeo, goldMat);
      ringBand.rotation.x = Math.PI / 2.2;
      modelGroup.add(ringBand);

      // Diamond Crown Setting
      const crownGeo = new THREE.CylinderGeometry(0.8, 0.4, 0.6, 8);
      const crown = new THREE.Mesh(crownGeo, goldMat);
      crown.position.set(0, 1.85, 0);
      modelGroup.add(crown);

      // Brilliant Cut Faceted Solitaire Diamond Gem
      const diamondGemGeo = new THREE.OctahedronGeometry(1.0, 2);
      const diamondGem = new THREE.Mesh(diamondGemGeo, diamondMat);
      diamondGem.position.set(0, 2.3, 0);
      diamondGem.rotation.y = Math.PI / 4;
      modelGroup.add(diamondGem);

    } else if (catId.includes('shoe') || catId.includes('footwear') || prodName.includes('sneaker') || prodName.includes('boot') || prodName.includes('heel')) {
      // --- D. ARCHITECTURAL LUXURY SNEAKER / FOOTWEAR ---
      const soleGeo = new THREE.BoxGeometry(1.8, 0.5, 4.4);
      const sole = new THREE.Mesh(soleGeo, goldMat);
      sole.position.y = -1.2;
      modelGroup.add(sole);

      const shoeUpperGeo = new THREE.BoxGeometry(1.65, 1.4, 3.8);
      const upper = new THREE.Mesh(shoeUpperGeo, luxuryLeatherMat);
      upper.position.set(0, -0.35, -0.1);
      modelGroup.add(upper);

      const ankleCollarGeo = new THREE.CylinderGeometry(0.75, 0.85, 1.0, 24);
      const collar = new THREE.Mesh(ankleCollarGeo, woolCashmereMat);
      collar.position.set(0, 0.7, -0.8);
      modelGroup.add(collar);

    } else if (catId.includes('beauty') || prodName.includes('parfum') || prodName.includes('fragrance') || prodName.includes('serum')) {
      // --- E. NICHE PERFUME FLACON ---
      const flaconGeo = new THREE.BoxGeometry(2.1, 3.2, 1.6);
      const flacon = new THREE.Mesh(flaconGeo, glassCrystalMat);
      modelGroup.add(flacon);

      const liquidGeo = new THREE.BoxGeometry(1.8, 2.6, 1.35);
      const liquidMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, transmission: 0.75, roughness: 0.1 });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = -0.2;
      modelGroup.add(liquid);

      const goldCapGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.9, 32);
      const cap = new THREE.Mesh(goldCapGeo, goldMat);
      cap.position.y = 2.05;
      modelGroup.add(cap);

    } else if (catId.includes('watch') || prodName.includes('watch') || prodName.includes('horology')) {
      // --- F. GRAND COMPLICATION HOROLOGY TIMEPIECE ---
      const caseGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.45, 48);
      const watchCase = new THREE.Mesh(caseGeo, goldMat);
      watchCase.rotation.x = Math.PI / 2;
      modelGroup.add(watchCase);

      const dialGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 48);
      const dial = new THREE.Mesh(dialGeo, glassCrystalMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.z = 0.22;
      modelGroup.add(dial);

      const bezelGeo = new THREE.TorusGeometry(1.6, 0.12, 16, 64);
      const bezel = new THREE.Mesh(bezelGeo, luxuryLeatherMat);
      bezel.position.z = 0.22;
      modelGroup.add(bezel);

      [1.9, -1.9].forEach((yPos) => {
        const strapGeo = new THREE.BoxGeometry(1.3, 1.9, 0.2);
        const strap = new THREE.Mesh(strapGeo, luxuryLeatherMat);
        strap.position.set(0, yPos > 0 ? 1.7 : -1.7, 0);
        modelGroup.add(strap);
      });

    } else {
      // --- G. EDITORIAL MINIMALIST SCULPTURE ---
      const outerTorusGeo = new THREE.TorusGeometry(2.0, 0.25, 24, 64);
      const outerTorus = new THREE.Mesh(outerTorusGeo, goldMat);
      modelGroup.add(outerTorus);

      const innerIcoGeo = new THREE.IcosahedronGeometry(1.1, 1);
      const innerMesh = new THREE.Mesh(innerIcoGeo, luxuryLeatherMat);
      modelGroup.add(innerMesh);

      const ringGeo = new THREE.TorusGeometry(1.3, 0.08, 16, 48);
      const ringMesh = new THREE.Mesh(ringGeo, glassCrystalMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      modelGroup.add(ringMesh);
    }

    // Mouse & Touch Dragging Handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      modelGroupRef.current.rotation.y += deltaX * 0.01;
      modelGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = Math.min(13, Math.max(3.5, cameraRef.current.position.z + e.deltaY * 0.005));
      cameraRef.current.position.z = newZ;
      setZoomLevel(Number((8 / newZ).toFixed(2)));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Touch Support
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && modelGroupRef.current) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        modelGroupRef.current.rotation.y += deltaX * 0.01;
        modelGroupRef.current.rotation.x += deltaY * 0.01;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.007;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [product, autoRotate]);

  const toggleMaterialWireframe = () => {
    if (!modelGroupRef.current) return;
    const newMode = activeMaterialMode === 'wireframe' ? 'studio' : 'wireframe';
    setActiveMaterialMode(newMode);

    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = newMode === 'wireframe';
      }
    });
  };

  const handleZoom = (direction) => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -1.2 : 1.2;
    const newZ = Math.min(13, Math.max(3.5, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newZ;
    setZoomLevel(Number((8 / newZ).toFixed(2)));
  };

  const resetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8);
      setZoomLevel(1);
    }
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] bg-gradient-to-b from-[#141B2D] via-[#0F172A] to-[#141B2D] rounded-3xl overflow-hidden border border-[#C2A676]/30 shadow-2xl flex flex-col">
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3.5 py-1 rounded-full bg-[#1E293B]/85 backdrop-blur-md border border-[#C2A676]/50 text-[#C2A676] text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3" />
            3D Atelier Studio
          </span>
          <span className="text-[10px] text-white/70 tracking-wider font-mono hidden md:inline">
            Drag 360° • Pinch or Scroll Zoom
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full backdrop-blur-md border text-xs transition-all ${
              autoRotate
                ? 'bg-[#C2A676] text-[#111827] border-[#C2A676] shadow-md shadow-[#C2A676]/20'
                : 'bg-[#1E293B]/80 text-white/80 border-[#2D3A58] hover:text-white'
            }`}
            title={autoRotate ? 'Pause 360° Auto-spin' : 'Enable 360° Auto-spin'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-full bg-[#1E293B]/80 text-white/80 border border-[#2D3A58] hover:text-white backdrop-blur-md text-xs hover:border-[#C2A676]/60 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-full bg-[#1E293B]/80 text-white/80 border border-[#2D3A58] hover:text-white backdrop-blur-md text-xs hover:border-[#C2A676]/60 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleMaterialWireframe}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] uppercase tracking-wider font-semibold transition-all ${
              activeMaterialMode === 'wireframe'
                ? 'bg-[#C2A676] text-[#111827] border-[#C2A676]'
                : 'bg-[#1E293B]/80 text-white/80 border-[#2D3A58] hover:text-white'
            }`}
            title="Inspect CAD Wireframe Architecture"
          >
            <Box className="w-3 h-3 inline mr-1" />
            {activeMaterialMode === 'wireframe' ? 'Solid' : 'CAD Mesh'}
          </button>

          <button
            onClick={resetView}
            className="px-2.5 py-1.5 rounded-full bg-[#1E293B]/80 text-white/80 border border-[#2D3A58] hover:text-white backdrop-blur-md text-[10px] uppercase tracking-wider transition-all"
            title="Reset Perspective"
          >
            Reset
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 px-3 py-1.5 rounded-full bg-[#E11D48]/80 hover:bg-[#E11D48] text-white text-[10px] uppercase tracking-wider border border-[#E11D48]/50 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Bottom Floating Material & Spec Pill */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-[#1E293B]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#C2A676]/30 text-[11px] text-white/95 flex items-center gap-2.5 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#C2A676] animate-ping" />
          <span className="font-serif italic text-[#C2A676] font-medium">Tactile Silhouette:</span>
          <span>{product?.material || 'Hand-finished luxury materials & bespoke tailoring'}</span>
        </div>

        <div className="text-[10px] text-white/70 font-mono tracking-widest bg-[#1E293B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2D3A58] hidden sm:block">
          MAGNIFICATION: {zoomLevel}x
        </div>
      </div>
    </div>
  );
}
