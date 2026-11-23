"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

interface ThreeProviderProps {
  children: React.ReactNode;
  autoRotate?: boolean;
  environment?: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest";
  className?: string;
}

function RotatingProduct({
  children,
  autoRotate = true,
}: {
  children: React.ReactNode;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export const ThreeProvider: React.FC<ThreeProviderProps> = ({
  children,
  autoRotate = true,
  environment = "studio",
  className = "",
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#bcd4ff" />
        <pointLight position={[0, -3, 3]} intensity={0.6} color="#ffffff" />
        <Environment preset={environment} background={false} />
        <RotatingProduct autoRotate={autoRotate}>{children}</RotatingProduct>
      </Canvas>
    </div>
  );
};

export default ThreeProvider;