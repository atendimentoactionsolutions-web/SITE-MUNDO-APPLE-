import React from "react";
import { clsx } from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "small" | "large" | "full";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  size = "default",
}) => {
  const sizeClasses = {
    small: "max-w-4xl",
    default: "max-w-7xl",
    large: "max-w-[90rem]",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "mx-auto px-4 sm:px-6 lg:px-8 w-full",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};
