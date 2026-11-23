"use client";

import React from "react";
import { MeshStandardMaterial } from "three";

interface MacBook3DProps {
  open?: boolean;
  color?: string;
  scale?: number;
}

export const MacBook3D: React.FC<MacBook3DProps> = ({
  open = true,
  color = "#C9C9CE",
  scale = 1,
}) => {
  const lidAngle = open ? -0.42 : 0; // radians (~-24 degrees opened back)

  return (
    <group scale={scale} rotation={[0.1, 0, 0]}>
      {/* BASE (keyboard deck) */}
      <group position={[0, -0.02, 0.35]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 1.4]} />
          <MeshStandardMaterial color={color} metalness={1.0} roughness={0.35} />
        </mesh>
        {/* Keyboard recess */}
        <mesh position={[0, 0.031, 0.08]}>
          <boxGeometry args={[1.8, 0.005, 0.9]} />
          <MeshStandardMaterial color="#101012" metalness={0.2} roughness={0.9} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.032, 0.58]}>
          <boxGeometry args={[0.7, 0.004, 0.42]} />
          <MeshStandardMaterial color="#1C1C1E" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* LID (display) hinged at the back edge */}
      <group position={[0, 0.01, -0.35]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, 0.66, 0]} castShadow>
          <boxGeometry args={[2.0, 1.32, 0.05]} />
          <MeshStandardMaterial color={color} metalness={1.0} roughness={0.35} />
        </mesh>
        {/* Screen bezel/frame */}
        <mesh position={[0, 0.66, 0.028]}>
          <boxGeometry args={[1.86, 1.18, 0.005]} />
          <MeshStandardMaterial color="#060606" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Active display */}
        <mesh position={[0, 0.66, 0.032]}>
          <planeGeometry args={[1.74, 1.06]} />
          <MeshStandardMaterial
            color="#1f4fbe"
            emissive="#1f4fbe"
            emissiveIntensity={0.55}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
};

export default MacBook3D;