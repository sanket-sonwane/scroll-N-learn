"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Experience, Track } from "@/lib/content/types";

type EndCardProps = {
  track: Track;
  experience: Experience;
  onRestart: () => void;
};

export function EndCard({ track, experience, onRestart }: EndCardProps) {
  const connect = experience.connect ?? [];
  const next = experience.next;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-7 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.base, ease: EASE_SPRING_ANIM }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/10 text-xl text-success"
      >
        <span aria-hidden="true">{experience.icon}</span>
      </motion.div>

      <div className="flex flex-col items-center gap-3">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.15 }}
          className="text-balance text-3xl font-semibold tracking-tight"
        >
          You just connected
        </motion.h2>

        {connect.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.3 }}
            className="flex flex-col items-center gap-1.5"
          >
            {connect.map((term, i) => (
              <span key={term} className="flex flex-col items-center gap-1.5">
                <span className="rounded-full border border-edge bg-surface/70 px-4 py-1 font-mono text-sm text-foreground">
                  {term}
                </span>
                {i < connect.length - 1 && (
                  <span className="text-faint" aria-hidden="true">
                    ↓
                  </span>
                )}
              </span>
            ))}
          </motion.div>
        )}

        {next && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.45 }}
            className="flex flex-col items-center gap-3"
          >
            <Chip tone={experience.accent}>next · {next.name}</Chip>
            <p className="max-w-sm text-sm leading-relaxed text-faint">
              {next.tagline}
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.6 }}
        className="flex flex-col items-center gap-3"
      >
        {next && (
          <Link
            href={`/feed/${next.id}/0`}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 font-medium text-background transition-colors hover:bg-white/90"
          >
            Continue · {next.name}
          </Link>
        )}
        <div className="flex items-center gap-3">
          <Button onClick={onRestart} variant="ghost">
            Replay {experience.name}
          </Button>
          <Link
            href="/"
            className="text-sm text-faint transition-colors hover:text-muted"
          >
            Explore experiences
          </Link>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[0.68rem] font-medium tracking-widest text-faint uppercase"
      >
        {track.title} · {experience.name}
      </motion.p>
    </div>
  );
}

const EASE_SPRING_ANIM = [0.34, 1.56, 0.64, 1] as const;