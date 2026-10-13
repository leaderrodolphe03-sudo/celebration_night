import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "outline-dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      target,
      rel,
      icon,
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-body uppercase transition-all duration-200 select-none whitespace-nowrap flex-nowrap shrink-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cn-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cn-black";

    const sizeStyles = {
      sm: "px-4 py-2 text-[11px] font-semibold tracking-wider",
      md: "px-6 py-3 text-xs font-bold tracking-[0.14em]",
      lg: "px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.16em]",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-cn-gold to-cn-amber text-cn-black font-extrabold shadow-md hover:brightness-110 hover:shadow-gold hover:scale-[1.01] active:scale-[0.98]",
      secondary:
        "bg-cn-dark/90 text-cn-gray-100 border border-white/10 hover:border-cn-gold/40 hover:bg-cn-deep hover:text-white active:scale-[0.98]",
      outline:
        "border border-white/20 text-white hover:border-cn-gold/50 hover:bg-white/5 hover:text-cn-gold-light active:scale-[0.98]",
      ghost:
        "text-cn-gray-300 hover:text-cn-gold-light hover:bg-white/5 active:scale-[0.98]",
      dark:
        "bg-cn-black text-white border border-cn-black hover:bg-cn-ground shadow-md hover:scale-[1.01] active:scale-[0.98]",
      "outline-dark":
        "border border-cn-black/30 text-cn-black hover:bg-black/5 hover:border-cn-black active:scale-[0.98]",
    };

    const combinedClasses = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    const content = (
      <>
        {loading ? (
          <Loader2 size={16} className="animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0 flex items-center">{icon}</span>
        ) : null}
        <span className="whitespace-nowrap">{children}</span>
      </>
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} disabled={disabled || loading} className={combinedClasses} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
