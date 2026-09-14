import React from "react";
import { clsx } from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) => {
  const alignment = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className={clsx("max-w-3xl mb-12 sm:mb-16", alignment[align], className)}>
      {eyebrow && (
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-apple-blue uppercase mb-2 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-apple-dark leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg md:text-xl text-apple-muted font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
