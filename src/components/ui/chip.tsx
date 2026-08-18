"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { duration } from "@/lib/motion";

type ChipProps = {
  children: ReactNode;
  tone?: "default" | "info" | "success" | "ai" | "warning";
  className?: string;
};

const TONES: Record<NonNullable<ChipProps["tone"]>, string> = {
  default: "text-muted border-edge",
  info: "text-info border-info/30 bg-info/10",
  success: "text-success border-success/30 bg-success/10",
  ai: "text-ai border-ai/30 bg-ai/10",
  warning: "text-warning border-warning/30 bg-warning/10",
};

export function Chip({ children, tone = "default", className = "" }: ChipProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.fast }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-medium tracking-wide uppercase ${TONES[tone]} ${className}`}
    >
      {children}
    </motion.span>
  );
}
