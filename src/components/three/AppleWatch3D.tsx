"use client";

import React from "react";
import { MeshStandardMaterial } from "three";

interface AppleWatch3DProps {
  caseColor?: string;
  bandColor?: string;
  scale?: number;
}

export const AppleWatch3D: React.FC<AppleWatch3DProps> = ({
  caseColor = "#1A1A1C",
  bandColor = "#1A1A1C",
  scale = 1.5,
}) => {
  return (
    <group scale={scale} rotation={[Math.PI / 10, 0.35, 0]}>
      {/* Case */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.06, 0.55]} />
        <MeshStandardMaterial color={caseColor} metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Front Display */}
      <mesh position={[0, 0.031, 0]} castShadow>
        <boxGeometry args={[0.38, 0.02, 0.48]} />
        <MeshStandardMaterial color="#000000" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Active Watch Face */}
      <mesh position={[0, 0.032, 0.006]}>
        <planeGeometry args={[0.34, 0.44]} />
        <MeshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.7} side={2} />
      </mesh>

      {/* Digital Crown */}
      <mesh position={[0.22, 0, 0.22]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 32]} />
        <MeshStandardMaterial color="#8A8A8F" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Side Button */}
      <mesh position={[0.22, 0, -0.22]}>
        <cylinderGeometry args={[0.05, 0.05, 0.05, 32]} />
        <MeshStandardMaterial color="#8A8A8F" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Top Band */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.05, 0.48]} />
        <MeshStandardMaterial color={bandColor} roughness={0.75} />
      </mesh>

      {/* Bottom Band */}
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.05, 0.48]} />
        <MeshStandardMaterial color={bandColor} roughness={0.75} />
      </mesh>
    </group>
  );
};

export default AppleWatch3D;