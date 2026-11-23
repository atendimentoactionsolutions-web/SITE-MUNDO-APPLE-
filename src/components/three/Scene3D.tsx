"use client";

import React from "react";
import { ThreeProvider } from "./ThreeProvider";
import { Iphone3D } from "./Iphone3D";
import { MacBook3D } from "./MacBook3D";
import { AppleWatch3D } from "./AppleWatch3D";
import { AirPods3D } from "./AirPods3D";
import { IPad3D } from "./IPad3D";

interface Scene3DProps {
  productType?: "iphone" | "macbook" | "watch" | "airpods" | "ipad" | "all";
  autoRotate?: boolean;
  environment?: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest";
  className?: string;
  height?: string;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  productType = "iphone",
  autoRotate = true,
  environment = "studio",
  className = "",
  height = "600px",
}) => {
  const renderProduct = () => {
    switch (productType) {
      case "iphone":
        return <Iphone3D color="#1D1D1F" screenOn={true} autoRotate={autoRotate} scale={1.2} />;
      case "macbook":
        return <MacBook3D open={true} color="#E3E3E8" autoRotate={autoRotate} scale={0.8} />;
      case "watch":
        return <AppleWatch3D color="#1A1A1C" bandColor="#1A1A1C" autoRotate={autoRotate} scale={1.5} />;
      case "airpods":
        return <AirPods3D color="#FFFFFF" autoRotate={autoRotate} scale={1.3} />;
      case "ipad":
        return <IPad3D color="#E3E3E8" screenOn={true} autoRotate={autoRotate} scale={1.0} />;
      case "all":
        return (
          <>
            <Iphone3D color="#1D1D1F" screenOn={true} autoRotate={autoRotate} scale={1.0} />
            <MacBook3D open={true} color="#E3E3E8" autoRotate={autoRotate} scale={0.7} />
            <AppleWatch3D color="#1A1A1C" bandColor="#1A1A1C" autoRotate={autoRotate} scale={1.2} />
            <AirPods3D color="#FFFFFF" autoRotate={autoRotate} scale={1.0} />
            <IPad3D color="#E3E3E8" screenOn={true} autoRotate={autoRotate} scale={0.9} />
          </>
        );
      default:
        return <Iphone3D color="#1D1D1F" screenOn={true} autoRotate={autoRotate} scale={1.2} />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      style={{ height }}
    >
      <ThreeProvider autoRotate={autoRotate} environment={environment}>
        {renderProduct()}
      </ThreeProvider>
    </div>
  );
};

export default Scene3D;