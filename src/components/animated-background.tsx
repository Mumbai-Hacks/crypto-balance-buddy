import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePreloader } from "./preloader";
import { useTheme } from "@/components/theme-provider";

const AnimatedBackground = () => {
  const { bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      // Purple/blue gradient colors
      colors[i] = 0.5 + Math.random() * 0.3; // R
      colors[i + 1] = 0.2 + Math.random() * 0.3; // G
      colors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Add some floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    const shapeGeometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.OctahedronGeometry(2, 0),
      new THREE.TetrahedronGeometry(2, 0),
    ];

    for (let i = 0; i < 5; i++) {
      const geo = shapeGeometries[i % shapeGeometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.5, 0.5),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40
      );
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.01;
      frameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0002;
        particlesRef.current.rotation.y += 0.0003;
      }

      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.position.y =
          shape.userData.originalY +
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 5;
      });

      renderer.render(scene, camera);
    };

    animate();
    bypassLoading();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
      shapes.forEach((shape) => {
        (shape.geometry as THREE.BufferGeometry).dispose();
        (shape.material as THREE.Material).dispose();
      });
    };
  }, [bypassLoading]);

  // Update background based on theme
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = theme === "dark" 
        ? new THREE.Color(0x0a0a0f)
        : new THREE.Color(0xf1f5f9);
    }
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ background: theme === "dark" ? "#0a0a0f" : "#f1f5f9" }}
    />
  );
};

export default AnimatedBackground;
