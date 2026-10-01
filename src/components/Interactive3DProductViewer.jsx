import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Box, Info } from 'lucide-react';

/**
 * Interactive 3D Product Inspector
 * Renders procedural, luxury 3D WebGL models (Smartphones, Horology Timepieces, Flacons/Perfumes, Footwear, Rings, and Accessories)
 * with interactive 360° mouse dragging, pinch/scroll zoom, ambient studio lighting, and materials inspection.
 */
export default function Interactive3DProductViewer({ product, onClose }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeMaterialMode, setActiveMaterialMode] = useState('studio'); // 'studio' | 'wireframe' | 'metallic'
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc2a676, 2.8);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x7388a8, 1.2);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    const ambient = new THREE.AmbientLight(0x22222a, 1.5);
    scene.add(ambient);

    // Procedural Model Builder based on Product Category
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const catId = (product?.category_id || '').toLowerCase();
    const prodName = (product?.name || '').toLowerCase();

    // Materials Library
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a3a40,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111116,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.9,
      reflectivity: 0.9,
    });

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
      clearcoat: 0.8,
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x2b1d14,
      roughness: 0.85,
      metalness: 0.05,
    });

    if (catId.includes('mobile') || prodName.includes('phone') || prodName.includes('tablet')) {
      // --- 3D SMARTPHONE / TABLET ---
      const bodyGeo = new THREE.BoxGeometry(2.4, 4.8, 0.24);
      const phoneMesh = new THREE.Mesh(bodyGeo, titaniumMat);
      modelGroup.add(phoneMesh);

      // OLED Screen
      const screenGeo = new THREE.PlaneGeometry(2.25, 4.6);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.125;
      modelGroup.add(screenMesh);

      // Camera Bump
      const camBumpGeo = new THREE.BoxGeometry(1.0, 1.2, 0.1);
      const camBump = new THREE.Mesh(camBumpGeo, titaniumMat);
      camBump.position.set(-0.55, 1.6, -0.16);
      modelGroup.add(camBump);

      // Triple Camera Lenses
      for (let i = 0; i < 3; i++) {
        const lensRingGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
        const lensRing = new THREE.Mesh(lensRingGeo, goldMat);
        lensRing.position.set(-0.55, 1.9 - i * 0.35, -0.22);
        modelGroup.add(lensRing);
      }
    } else if (catId.includes('audio') || catId.includes('watch') || prodName.includes('watch') || prodName.includes('headphone')) {
      // --- 3D LUXURY HOROLOGY TIMEPIECE / HEADPHONES ---
      if (prodName.includes('headphone')) {
        // Headband
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.8, -0.4, 0),
          new THREE.Vector3(-1.5, 2.2, 0),
          new THREE.Vector3(0, 2.5, 0),
          new THREE.Vector3(1.5, 2.2, 0),
          new THREE.Vector3(1.8, -0.4, 0),
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.16, 16, false);
        const bandMesh = new THREE.Mesh(tubeGeo, leatherMat);
        modelGroup.add(bandMesh);

        // Dual Earcups
        [-1.8, 1.8].forEach(x => {
          const cupGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
          const cup = new THREE.Mesh(cupGeo, titaniumMat);
          cup.rotation.z = Math.PI / 2;
          cup.position.set(x, -0.4, 0);
          modelGroup.add(cup);

          const ringGeo = new THREE.TorusGeometry(0.65, 0.05, 16, 32);
          const ring = new THREE.Mesh(ringGeo, goldMat);
          ring.rotation.y = Math.PI / 2;
          ring.position.set(x > 0 ? x + 0.25 : x - 0.25, -0.4, 0);
          modelGroup.add(ring);
        });
      } else {
        // Watch Case
        const caseGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.38, 48);
        const watchCase = new THREE.Mesh(caseGeo, goldMat);
        watchCase.rotation.x = Math.PI / 2;
        modelGroup.add(watchCase);

        // Sapphire Dial Glass
        const dialGeo = new THREE.CylinderGeometry(1.42, 1.42, 0.05, 48);
        const dial = new THREE.Mesh(dialGeo, glassMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.z = 0.18;
        modelGroup.add(dial);

        // Outer Horology Bezel
        const bezelGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
        const bezel = new THREE.Mesh(bezelGeo, titaniumMat);
        bezel.position.z = 0.18;
        modelGroup.add(bezel);

        // Watch Straps
        [1.8, -1.8].forEach(y => {
          const strapGeo = new THREE.BoxGeometry(1.2, 1.8, 0.18);
          const strap = new THREE.Mesh(strapGeo, leatherMat);
          strap.position.set(0, y > 0 ? 1.6 : -1.6, 0);
          modelGroup.add(strap);
        });
      }
    } else if (catId.includes('beauty') || prodName.includes('parfum') || prodName.includes('fragrance') || prodName.includes('serum')) {
      // --- 3D NICHE PERFUME FLACON ---
      const bottleGeo = new THREE.BoxGeometry(1.9, 2.8, 1.4);
      const bottle = new THREE.Mesh(bottleGeo, glassMat);
      modelGroup.add(bottle);

      // Interior Amber Liquid
      const liquidGeo = new THREE.BoxGeometry(1.65, 2.3, 1.2);
      const liquidMat = new THREE.MeshPhysicalMaterial({ color: 0xc27a29, transmission: 0.7, roughness: 0.1 });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = -0.15;
      modelGroup.add(liquid);

      // Gold Cap
      const capGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 32);
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.y = 1.8;
      modelGroup.add(cap);

      // Collar Ring
      const ringGeo = new THREE.TorusGeometry(0.48, 0.08, 16, 32);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.42;
      modelGroup.add(ring);
    } else {
      // --- ARCHITECTURAL LUXURY VESSEL / SCULPTURAL ACCENT ---
      const outerTorusGeo = new THREE.TorusGeometry(1.8, 0.22, 24, 64);
      const outerTorus = new THREE.Mesh(outerTorusGeo, goldMat);
      modelGroup.add(outerTorus);

      const innerIcoGeo = new THREE.IcosahedronGeometry(1.0, 1);
      const innerMesh = new THREE.Mesh(innerIcoGeo, titaniumMat);
      modelGroup.add(innerMesh);

      const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 16, 48);
      const ringMesh = new THREE.Mesh(ringGeo, glassMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      modelGroup.add(ringMesh);
    }

    setLoading(false);

    // Mouse Interaction Handlers
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
      const newZ = Math.min(14, Math.max(4, cameraRef.current.position.z + e.deltaY * 0.005));
      cameraRef.current.position.z = newZ;
      setZoomLevel(Number((8 / newZ).toFixed(2)));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support for mobile
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
        modelGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
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
    <div className="relative w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-[#13111C] via-[#0B0A0E] to-[#13111C] rounded-2xl overflow-hidden border border-[#24222E] shadow-2xl flex flex-col">
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C2A676]/40 text-[#C2A676] text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            3D Studio Viewer
          </span>
          <span className="text-[10px] text-white/60 tracking-wider font-mono hidden sm:inline">
            Drag to Rotate • Scroll to Zoom
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full backdrop-blur-md border text-xs transition-all ${
              autoRotate 
                ? 'bg-[#C2A676] text-[#0B0A0E] border-[#C2A676]' 
                : 'bg-black/60 text-white/80 border-white/20 hover:text-white'
            }`}
            title={autoRotate ? 'Pause 360° Auto-spin' : 'Enable 360° Auto-spin'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleMaterialWireframe}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] uppercase tracking-wider font-semibold transition-all ${
              activeMaterialMode === 'wireframe'
                ? 'bg-[#C2A676] text-[#0B0A0E] border-[#C2A676]'
                : 'bg-black/60 text-white/80 border-white/20 hover:text-white'
            }`}
            title="Inspect CAD Wireframe Architecture"
          >
            <Box className="w-3 h-3 inline mr-1" />
            {activeMaterialMode === 'wireframe' ? 'Solid' : 'CAD Mesh'}
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-full bg-black/60 text-white/80 border border-white/20 hover:text-white backdrop-blur-md text-xs"
            title="Reset Camera"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] uppercase tracking-wider border border-white/20"
            >
              Close 3D
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas Mounting Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Bottom Floating Material & Spec Pill */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] text-white/90 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2A676] animate-pulse" />
          <span className="font-serif italic text-[#C2A676]">Tactile Spec:</span>
          <span>{product?.material || 'Aerospace grade alloy & sapphire finish'}</span>
        </div>

        <div className="text-[10px] text-white/50 font-mono tracking-widest hidden sm:block">
          ZOOM: {zoomLevel}x
        </div>
      </div>
    </div>
  );
}
