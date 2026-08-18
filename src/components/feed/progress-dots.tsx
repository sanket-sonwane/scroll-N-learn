"use client";

import { motion } from "motion/react";
import { duration, EASE_SOFT } from "@/lib/motion";

type ProgressDotsProps = {
  count: number;
  current: number;
};

export function ProgressDots({ count, current }: ProgressDotsProps) {
  return (
    <div className="pointer-events-none absolute top-1/2 right-3 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5 sm:right-5">
      {Array.from({ length: count }, (_, i) => {
        const active = i === current;
        return (
          <motion.span
            key={i}
            animate={{
              height: active ? 18 : 5,
              width: active ? 5 : 5,
              backgroundColor: active
                ? "rgba(237,239,244,0.95)"
                : i < current
                  ? "rgba(237,239,244,0.5)"
                  : "rgba(237,239,244,0.22)",
            }}
            transition={{ duration: duration.fast, ease: EASE_SOFT }}
            className="block rounded-full"
          />
        );
      })}
    </div>
  );
}