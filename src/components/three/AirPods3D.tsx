"use client";

import React from "react";
import { MeshStandardMaterial } from "three";

interface AirPods3DProps {
  color?: string;
  scale?: number;
}

export const AirPods3D: React.FC<AirPods3DProps> = ({
  color = "#FFFFFF",
  scale = 1.3,
}) => {
  return (
    <group scale={scale}>
      {/* Charging Case */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.3, 0.45]} />
        <MeshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Case Hinge */}
      <mesh position={[0, 0.145, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />
        <MeshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Left AirPod */}
      <group position={[-0.12, 0.15, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 32]} />
          <MeshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <MeshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>

      {/* Right AirPod */}
      <group position={[0.12, 0.15, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 32]} />
          <MeshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <MeshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>

      {/* LED Indicator */}
      <mesh position={[0, -0.21, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <MeshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

export default AirPods3D;