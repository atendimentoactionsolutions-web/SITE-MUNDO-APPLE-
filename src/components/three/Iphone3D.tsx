"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";

interface Iphone3DProps {
  color?: string;
  screenOn?: boolean;
  autoRotate?: boolean;
  scale?: number;
}

export const Iphone3D: React.FC<Iphone3DProps> = ({
  color = "#1D1D1F",
  screenOn = true,
  autoRotate = true,
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={[0, Math.PI / 4, 0]}>
      <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.6, 0.08]} />
        <MeshStandardMaterial color={color} metalness={0.9} roughness={0.2} envMapIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[0.77, 1.62, 0.02]} />
        <MeshStandardMaterial color="#2A2A2C" metalness={1.0} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.03]} castShadow>
        <boxGeometry args={[0.73, 1.58, 0.01]} />
        <MeshStandardMaterial color={screenOn ? "#000000" : "#1A1A1A"} metalness={0.1} roughness={0.05} />
      </mesh>
      {screenOn && (
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.68, 1.5, 0.01]} />
          <MeshStandardMaterial color="#1a5fd8" emissive="#1a5fd8" emissiveIntensity={0.3} side={2} />
        </mesh>
      )}
      <mesh position={[0, -0.15, -0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 0.3, 0.01]} />
        <MeshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

export default Iphone3D;