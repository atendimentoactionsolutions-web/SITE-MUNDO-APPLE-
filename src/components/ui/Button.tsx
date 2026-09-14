import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  className = "",
  icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer text-center select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow",
    secondary:
      "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-slate-200 border border-[#E5E7EB]",
    dark:
      "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm",
    ghost:
      "bg-transparent text-[#0071E3] hover:underline hover:bg-blue-50/50",
    whatsapp:
      "bg-[#00C853] text-white hover:bg-[#00B048] shadow-sm font-semibold",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5",
  };

  const combinedClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={combinedClasses}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
