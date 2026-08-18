"use client";

import { motion } from "motion/react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { duration, EASE_SPRING } from "@/lib/motion";

type Variant = "primary" | "ghost";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  variant?: Variant;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-foreground text-background"
      : "border border-edge bg-surface/60 text-foreground";
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: duration.micro, ease: EASE_SPRING }}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-medium transition-colors ${
        variant === "primary"
          ? "hover:bg-white/90"
          : "hover:border-edge-strong hover:bg-surface-2"
      } ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
