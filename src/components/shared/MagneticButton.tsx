"use client";

import { cn } from "@/lib/cn";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "light";
  asChild?: boolean;
}

export function MagneticButton({
  className,
  variant = "solid",
  children,
  ...props
}: MagneticButtonProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic(0.28);

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "ba-button focus-ring will-change-transform",
        variant === "ghost" && "ba-button-ghost",
        variant === "light" && "ba-button-light",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function MagneticLink({
  href,
  className,
  variant = "solid",
  children,
  onClick,
  "aria-disabled": ariaDisabled,
}: {
  href: string;
  className?: string;
  variant?: "solid" | "ghost" | "light";
  children: React.ReactNode;
  onClick?: () => void;
  "aria-disabled"?: boolean;
}) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic(0.28);

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={ariaDisabled ? undefined : href}
      onClick={(e) => {
        if (ariaDisabled) {
          e.preventDefault();
          return;
        }
        onClick?.();
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-disabled={ariaDisabled}
      className={cn(
        "ba-button focus-ring will-change-transform",
        variant === "ghost" && "ba-button-ghost",
        variant === "light" && "ba-button-light",
        className,
      )}
    >
      {children}
    </a>
  );
}
