"use client";

import React from "react";
import { MeshStandardMaterial } from "three";

interface IPad3DProps {
  color?: string;
  scale?: number;
}

export const IPad3D: React.FC<IPad3DProps> = ({
  color = "#C9C9CE",
  scale = 1.0,
}) => {
  return (
    <group scale={scale} rotation={[0.1, 0.3, 0]}>
      {/* iPad Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.04, 0.9]} />
        <MeshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Front Display */}
      <mesh position={[0, 0.022, 0]} castShadow>
        <boxGeometry args={[1.1, 0.01, 0.8]} />
        <MeshStandardMaterial color="#000000" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Active Screen */}
      <mesh position={[0, 0.028, 0.008]}>
        <planeGeometry args={[1.0, 0.7]} />
        <MeshStandardMaterial color="#1a5fd8" emissive="#1a5fd8" emissiveIntensity={0.35} side={2} />
      </mesh>

      {/* Camera - Top Left */}
      <mesh position={[-0.5, -0.02, 0.4]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <MeshStandardMaterial color="#2A2A2C" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Home Button */}
      <mesh position={[0, -0.42, 0.05]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
        <MeshStandardMaterial color="#8A8A8F" metalness={1.0} roughness={0.2} />
      </mesh>
    </group>
  );
};

export default IPad3D;