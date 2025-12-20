import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS, Skill } from "@/data/constants";

interface KeycapProps {
  position: [number, number, number];
  skill: Skill;
  onHover: (skill: Skill | null) => void;
}

const Keycap: React.FC<KeycapProps> = ({ position, skill, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05 + 0.15;
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          position[1],
          0.1
        );
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(skill);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[0.85, 0.35, 0.85]} />
      <meshStandardMaterial
        color={hovered ? skill.color : "#2a2a3a"}
        emissive={hovered ? skill.color : "#1a1a2a"}
        emissiveIntensity={hovered ? 0.4 : 0.05}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
};

interface KeyboardProps {
  onSkillHover: (skill: Skill | null) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onSkillHover }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const skillsArray = useMemo(() => Object.values(SKILLS).slice(0, 24), []);
  
  const keyPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const rows = 4;
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - (cols - 1) / 2) * 0.95;
        const z = (row - (rows - 1) / 2) * 0.95;
        positions.push([x, 0.2, z]);
      }
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Keyboard base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[6.5, 0.3, 4.5]} />
          <meshStandardMaterial 
            color="#121220" 
            metalness={0.6} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Keyboard rim */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[6.2, 0.1, 4.2]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.5} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Keycaps */}
        {skillsArray.map((skill, index) => (
          <Keycap
            key={skill.name}
            position={keyPositions[index] || [0, 0.2, 0]}
            skill={skill}
            onHover={onSkillHover}
          />
        ))}
      </group>
    </Float>
  );
};

interface Keyboard3DProps {
  onSkillHover?: (skill: Skill | null) => void;
}

const Keyboard3D: React.FC<Keyboard3DProps> = ({ onSkillHover }) => {
  const handleSkillHover = (skill: Skill | null) => {
    onSkillHover?.(skill);
  };

  return (
    <Canvas
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={45} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#8b5cf6" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#3b82f6" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#ffffff"
      />
      <Keyboard onSkillHover={handleSkillHover} />
    </Canvas>
  );
};

export default Keyboard3D;
