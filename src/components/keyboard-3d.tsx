import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS, SkillNames, Skill } from "@/data/constants";

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
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05 + 0.1;
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
      <boxGeometry args={[0.9, 0.4, 0.9]} />
      <meshStandardMaterial
        color={hovered ? skill.color : "#2a2a3a"}
        emissive={hovered ? skill.color : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
        metalness={0.3}
        roughness={0.4}
      />
      <Text
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={hovered ? "#ffffff" : "#888888"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {skill.label.substring(0, 3).toUpperCase()}
      </Text>
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
        const x = (col - (cols - 1) / 2) * 1;
        const z = (row - (rows - 1) / 2) * 1;
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Keyboard base */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[7, 0.3, 5]} />
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
            position={keyPositions[index] || [0, 0, 0]}
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
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />
      <Keyboard onSkillHover={handleSkillHover} />
    </Canvas>
  );
};

export default Keyboard3D;
