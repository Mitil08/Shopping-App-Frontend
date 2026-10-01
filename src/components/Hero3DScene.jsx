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
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Studio Specular Highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.PointLight(0xd4af37, 3.5, 50);
    goldKeyLight.position.set(12, 10, 15);
    scene.add(goldKeyLight);

    const cyanRimLight = new THREE.PointLight(0x38bdf8, 3.0, 50);
    cyanRimLight.position.set(-14, -8, 12);
    scene.add(cyanRimLight);

    const purpleBackLight = new THREE.PointLight(0xa855f7, 2.5, 40);
    purpleBackLight.position.set(0, 14, -10);
    scene.add(purpleBackLight);

    // 3. Central Flagship Object: Floating 3D Quantum Gyroscopic Sphere & Ring Array
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // A. Center Floating Gem Core (Icosahedron Titanium Facet)
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x1f1b2b : 0xfbf8f1,
      emissive: isDark ? 0x2e1065 : 0xc2a676,
      emissiveIntensity: 0.25,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Wireframe overlay on core
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc2a676,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    mainGroup.add(wireMesh);

    // B. Torus Rings (Horology & Precision Tech Gyroscope)
    const rings = [];
    const ringColors = [0xd4af37, 0x38bdf8, 0xe879f9];
    const ringRadii = [3.8, 4.7, 5.6];

    ringRadii.forEach((rad, idx) => {
      const torusGeo = new THREE.TorusGeometry(rad, 0.05, 16, 100);
      const torusMat = new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        metalness: 0.95,
        roughness: 0.2,
        emissive: ringColors[idx],
        emissiveIntensity: 0.3,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.rotation.x = (idx * Math.PI) / 3;
      torusMesh.rotation.y = (idx * Math.PI) / 4;
      mainGroup.add(torusMesh);
      rings.push(torusMesh);
    });

    // C. Surrounding Floating Polyhedra (Smart Devices, Crystals & Perfume Geometry)
    const floatingNodes = [];
    const nodeGeos = [
      new THREE.OctahedronGeometry(0.75, 0),
      new THREE.DodecahedronGeometry(0.65, 0),
      new THREE.TetrahedronGeometry(0.8, 0),
      new THREE.BoxGeometry(0.8, 1.3, 0.15), // Sleek smartphone profile
      new THREE.CylinderGeometry(0.35, 0.35, 1.1, 16), // Niche fragrance flacon cylinder
      new THREE.TorusGeometry(0.6, 0.12, 16, 32), // Smartwatch case
    ];

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.18,
      wireframe: false,
    });

    const nodeWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    for (let i = 0; i < 18; i++) {
      const geo = nodeGeos[i % nodeGeos.length];
      const mesh = new THREE.Mesh(geo, nodeMat);

      // Add wireframe child
      const wire = new THREE.Mesh(geo, nodeWireMat);
      wire.scale.set(1.02, 1.02, 1.02);
      mesh.add(wire);

      // Distribute in dynamic 3D sphere orbit
      const radius = 7.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      mesh.userData = {
        orbitRadius: radius,
        speed: 0.003 + Math.random() * 0.005,
        theta,
        phi,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        bobSpeed: 0.02 + Math.random() * 0.03,
      };

      scene.add(mesh);
      floatingNodes.push(mesh);
    }

    // D. 3D Particle Stardust (Deep Field Ambience)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cGold = new THREE.Color(0xd4af37);
    const cCyan = new THREE.Color(0x38bdf8);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 35;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const chosenColor = Math.random() > 0.5 ? cGold : Math.random() > 0.5 ? cCyan : cWhite;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Mouse Interactive Parallax
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

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.25 + mouseX * 2.5;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 + mouseY * 2;
      mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.35;

      // Rotate individual gyro rings at different multi-axis speeds
      rings.forEach((ring, idx) => {
        ring.rotation.x += (0.008 + idx * 0.004) * (idx % 2 === 0 ? 1 : -1);
        ring.rotation.y += (0.006 + idx * 0.005) * (idx % 2 === 0 ? -1 : 1);
        ring.rotation.z += 0.004;
      });

      // Animate floating product & geometric nodes
      floatingNodes.forEach((node) => {
        const d = node.userData;
        d.theta += d.speed;

        node.position.x = d.orbitRadius * Math.sin(d.phi) * Math.cos(d.theta);
        node.position.y =
          d.orbitRadius * Math.sin(d.phi) * Math.sin(d.theta) +
          Math.sin(elapsedTime * 2 + d.theta) * 0.35;
        node.position.z = d.orbitRadius * Math.cos(d.phi);

        node.rotation.x += d.rotSpeedX;
        node.rotation.y += d.rotSpeedY;
      });

      // Slow particle field drift
      particleSystem.rotation.y = -elapsedTime * 0.02;
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
