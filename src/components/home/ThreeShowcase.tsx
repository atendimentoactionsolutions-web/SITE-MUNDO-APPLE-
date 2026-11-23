"use client";

import React from "react";
import { ThreeProvider } from "@/components/three/ThreeProvider";
import { Iphone3D } from "@/components/three/Iphone3D";
import { MacBook3D } from "@/components/three/MacBook3D";
import { AppleWatch3D } from "@/components/three/AppleWatch3D";
import { AirPods3D } from "@/components/three/AirPods3D";
import { IPad3D } from "@/components/three/IPad3D";

interface ThreeShowcaseProps {
  environment?: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest";
  height?: string;
  className?: string;
}

export const ThreeShowcase: React.FC<ThreeShowcaseProps> = ({
  environment = "studio",
  height = "500px",
  className = "",
}) => {
  return (
    <div
      className={`relative ${className} overflow-hidden rounded-3xl`}
      style={{ height, width: "100%" }}
    >
      <ThreeProvider autoRotate={true} environment={environment}>
        <group>
          <Iphone3D color="#1D1D1F" screenOn={true} scale={1.3} />
          <MacBook3D open={true} color="#E3E3E8" scale={0.9} />
          <IPad3D color="#E3E3E8" scale={1.1} />
          <AppleWatch3D caseColor="#1A1A1C" bandColor="#1A1A1C" scale={1.5} />
          <AirPods3D color="#FFFFFF" scale={1.2} />
        </group>
      </ThreeProvider>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
        }}
      >
        <h1 className="text-5xl font-bold mb-4 animate-pulse">Apple Products 3D Showcase</h1>
        <p className="text-xl max-w-2xl text-center">Realistic 3D models of all Apple products with interactive animations.</p>
      </div>

      <div
        className="absolute inset-0 opacity-30 rounded-3xl -z-10 blur-2xl"
        style={{ background: "radial-gradient(circle at 30% 20%, #1a5fd8, transparent 50%), radial-gradient(circle at 70% 80%, #ff6b6b, transparent 50%)" }}
      />
    </div>
  );
};

export default ThreeShowcase;