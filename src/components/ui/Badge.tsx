import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "used" | "available" | "featured" | "battery" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}) => {
  const base = "inline-flex items-center font-medium rounded-full tracking-wide";
  
  const variants = {
    new: "bg-apple-blue/10 text-apple-blue border border-apple-blue/20",
    used: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
    available: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
    featured: "bg-purple-500/10 text-purple-700 border border-purple-500/20",
    battery: "bg-emerald-500 text-white font-semibold",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={clsx(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
