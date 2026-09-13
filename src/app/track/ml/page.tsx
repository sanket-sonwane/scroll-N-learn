"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { getTrack, getExperiences } from "@/lib/content/loader";
import { readProgress, clearProgress } from "@/lib/state/progress";
import { duration, EASE_SOFT } from "@/lib/motion";

const TRACK_ID = "ml-zero-to-hero";

const ACCENT_STYLES = {
  info: {
    text: "text-info",
    ring: "border-info/40",
    icon: "bg-info/10",
    bar: "from-info to-ai",
  },
  success: {
    text: "text-success",
    ring: "border-success/40",
    icon: "bg-success/10",
    bar: "from-success to-info",
  },
  warning: {
    text: "text-warning",
    ring: "border-warning/40",
    icon: "bg-warning/10",
    bar: "from-warning to-error",
  },
  ai: {
    text: "text-ai",
    ring: "border-ai/40",
    icon: "bg-ai/10",
    bar: "from-ai to-info",
  },
} as const;

export default function MLLanding() {
  const track = getTrack(TRACK_ID);
  const experiences = getExperiences(TRACK_ID);

  return (
    <main className="relative h-full overflow-y-auto">
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-2xl flex-col gap-8 px-6 pt-[max(env(safe-area-inset-top),2.5rem)] pb-12">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT }}
          className="mt-6 flex flex-col items-start gap-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-ai/40 bg-ai/10 text-lg">
              <span aria-hidden="true">λ</span>
            </span>
            <span className="text-lg font-semibold tracking-tight">ScrollLearn</span>
          </div>
          <h1 className="text-balance text-[clamp(2rem,7.5vw,3.2rem)] leading-[1.05] font-semibold tracking-tight">
            {track.title}
          </h1>
          <p className="text-balance max-w-md text-base leading-relaxed text-muted">
            {track.subtitle}. Every concept shows up as a behavior you can watch, bend, and break — never a definition you memorize.
          </p>
          <p className="max-w-md text-sm leading-relaxed text-faint">
            {experiences.length} experiences · one journey. The end of each door opens the next.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.12 }}
          className="flex flex-col gap-3"
        >
          <span className="font-mono text-[0.68rem] tracking-widest text-faint uppercase">
            {track.topic}
          </span>
          {experiences.map((exp, i) => {
            const styles = ACCENT_STYLES[exp.accent];
            const total = exp.cards.length;
            const progress = readProgress(exp.id);
            const completed = Math.min(progress.completed.length, total);
            const resume = Math.min(progress.index, total);
            const finished = completed >= total || resume >= total;
            const fresh = completed === 0;
            const pct = total ? Math.round((completed / total) * 100) : 0;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.18 + i * 0.07 }}
                className={`glass-panel flex flex-col gap-3 rounded-3xl border ${styles.ring} p-5`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${styles.icon} ${styles.text}`}
                  >
                    <span aria-hidden="true">{exp.icon}</span>
                  </span>
                  <div className="min-w-0">
                    <h2 className={`text-base font-semibold tracking-tight ${styles.text}`}>
                      {exp.name}
                    </h2>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">
                      {exp.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: duration.base, ease: EASE_SOFT }}
                      />
                    </div>
                    <span className="font-mono text-[0.68rem] text-muted tabular-nums">
                      {completed} / {total}
                    </span>
                  </div>
                  <Link
                    href={`/feed/${exp.id}/${finished ? 0 : resume}`}
                    className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${styles.ring} ${styles.text} hover:bg-surface-2`}
                  >
                    {finished ? "Replay" : fresh ? "Begin" : "Continue"}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

<motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 0.5 }}
          className="flex flex-col items-center gap-3 pb-2"
        >
          <button
            type="button"
            onClick={() => experiences.forEach((exp) => clearProgress(exp.id))}
            className="text-sm text-faint transition-colors hover:text-muted"
          >
            Start over
          </button>
          <div className="flex items-center gap-2">
            <Chip tone="ai">{track.domain}</Chip>
            <Chip tone="info">{track.chapter}</Chip>
          </div>
          <Link href="/" className="text-sm text-faint transition-colors hover:text-muted">
            Home · Algorithms Playground →
          </Link>
          <Link
            href="/track/attention"
            className="text-sm text-faint transition-colors hover:text-muted"
          >
            Switch track · Transformer Attention →
          </Link>
        </motion.footer>
      </div>
    </main>
  );
}