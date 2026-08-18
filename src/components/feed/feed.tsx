"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { CardRenderer } from "@/components/cards/renderer";
import { ProgressDots } from "@/components/feed/progress-dots";
import { EndCard } from "@/components/feed/end-card";
import type { Card, Experience, Track } from "@/lib/content/types";
import { recordCardSeen } from "@/lib/state/progress";
import { track as trackEvent } from "@/lib/state/analytics";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT, EASE_SPRING } from "@/lib/motion";

type FeedProps = {
  track: Track;
  experience: Experience;
  initialIndex: number;
};

export function Feed({ track, experience, initialIndex }: FeedProps) {
  const cards = useMemo(() => experience.cards, [experience]);
  const total = cards.length;
  const reduced = usePrefersReducedMotion();

  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, total)),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const offsetY = useMotionValue(0);
  const dragRef = useRef({ active: false, startY: 0, lastY: 0, lastT: 0, vel: 0 });
  const settlingRef = useRef(false);
  const wheelLock = useRef(0);
  const indexRef = useRef(index);
  const dwellRef = useRef({ index: 0, enteredAt: 0 });

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const jump = useCallback(
    (target: number) => {
      offsetY.set(0);
      settlingRef.current = false;
      setIndex(Math.max(0, Math.min(target, total)));
    },
    [offsetY, total],
  );

  const go = useCallback(
    (delta: 1 | -1) => {
      if (settlingRef.current) return;
      const cur = indexRef.current;
      const next = cur + delta;
      if (next < 0 || next > total) {
        animate(offsetY, 0, {
          duration: reduced ? 0 : duration.base,
          ease: EASE_SOFT,
        });
        return;
      }
      settlingRef.current = true;
      const h = containerRef.current?.clientHeight ?? window.innerHeight;
      animate(offsetY, -delta * h, {
        duration: reduced ? 0 : 0.45,
        ease: EASE_SOFT,
        onComplete: () => {
          offsetY.set(0);
          settlingRef.current = false;
          setIndex(next);
          const card = cards[cur];
          if (card) {
            trackEvent({
              type: delta === 1 ? "card_complete" : "card_back",
              cardId: card.id,
              index: cur,
              ts: Date.now(),
            });
          }
        },
      });
    },
    [cards, total, offsetY, reduced],
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (settlingRef.current) return;
    if ((e.target as Element).closest?.("button, a, input")) return;
    const d = dragRef.current;
    d.active = true;
    d.startY = e.clientY;
    d.lastY = e.clientY;
    d.lastT = performance.now();
    d.vel = 0;
    containerRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const now = performance.now();
      const dy = e.clientY - d.lastY;
      const dt = Math.max(1, now - d.lastT);
      d.vel = 0.7 * d.vel + 0.3 * (dy / dt);
      d.lastY = e.clientY;
      d.lastT = now;
      offsetY.set(e.clientY - d.startY);
    },
    [offsetY],
  );

  const onPointerUp = useCallback(() => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    const dist = offsetY.get();
    if (dist < -64 || d.vel < -0.6) go(1);
    else if (dist > 64 || d.vel > 0.6) go(-1);
    else
      animate(offsetY, 0, {
        duration: reduced ? 0 : duration.base,
        ease: EASE_SPRING,
      });
  }, [go, offsetY, reduced]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (settlingRef.current) return;
      if (Math.abs(e.deltaY) < 20) return;
      const now = Date.now();
      if (now - wheelLock.current < 280) return;
      wheelLock.current = now;
      go(e.deltaY > 0 ? 1 : -1);
    },
    [go],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") go(1);
      else if (e.key === "ArrowUp" || e.key === "PageUp") go(-1);
      else if (e.key === "Home") jump(0);
      else if (e.key === "End") jump(total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump, total]);

  // dwell + attention events
  useEffect(() => {
    const now = Date.now();
    const prev = dwellRef.current;
    if (prev.index !== index && prev.index < cards.length) {
      trackEvent({
        type: "card_exit",
        cardId: cards[prev.index].id,
        index: prev.index,
        ts: now,
      });
    }
    dwellRef.current = { index, enteredAt: now };
    if (index < cards.length) {
      const card = cards[index];
      recordCardSeen(experience.id, index, card.id);
      trackEvent({ type: "card_enter", cardId: card.id, index, ts: now });
      trackEvent({ type: "card_view", cardId: card.id, index, ts: now });
    } else {
      trackEvent({
        type: "experience_complete",
        experienceId: experience.id,
        ts: now,
      });
    }
  }, [index, cards, experience.id]);

  useEffect(() => {
    trackEvent({
      type: "experience_start",
      experienceId: experience.id,
      ts: Date.now(),
    });
    trackEvent({ type: "session_start", cardId: null, ts: Date.now() });
    return () => {
      trackEvent({ type: "session_end", cardId: null, ts: Date.now() });
      if (dwellRef.current.index < cards.length) {
        trackEvent({
          type: "card_exit",
          cardId: cards[dwellRef.current.index].id,
          index: dwellRef.current.index,
          ts: Date.now(),
        });
      }
    };
  }, [experience.id, cards]);

  useEffect(() => {
    try {
      window.history.replaceState(null, "", `/feed/${experience.id}/${index}`);
    } catch {
      /* ignore */
    }
  }, [index, experience.id]);

  const handleAnswer = useCallback(
    (cardId: string, correct: boolean) => {
      const card = cards[indexRef.current];
      if (card?.type === "quiz") {
        trackEvent({ type: "learning_check", cardId, correct, ts: Date.now() });
      } else {
        trackEvent({ type: "prediction_answer", cardId, correct, ts: Date.now() });
        if (correct) {
          trackEvent({ type: "prediction_correct", cardId, ts: Date.now() });
        }
      }
    },
    [cards],
  );

  const handleReplay = useCallback((cardId: string) => {
    trackEvent({ type: "animation_replay", cardId, ts: Date.now() });
  }, []);

  const handleInteract = useCallback((cardId: string) => {
    trackEvent({ type: "interaction_complete", cardId, ts: Date.now() });
  }, []);

  const handleRank = useCallback((cardId: string, correct: boolean) => {
    trackEvent({ type: "rank_submit", cardId, correct, ts: Date.now() });
  }, []);

  const atEnd = index >= total;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      className="fixed inset-0 touch-none overflow-hidden"
      style={{ overscrollBehavior: "none" }}
      aria-label="Learning feed. Swipe up or down to move between cards."
    >
      {index > 0 && (
        <CardLayer
          key={`${index - 1}-prev`}
          card={cards[index - 1]}
          active={false}
          offset={-1}
          offsetY={offsetY}
        />
      )}

      {!atEnd ? (
        <>
          <CardLayer
            key={`${index}-cur`}
            card={cards[index]}
            active
            offset={0}
            offsetY={offsetY}
            onAnswer={handleAnswer}
            onReplay={handleReplay}
            onInteract={handleInteract}
            onRank={handleRank}
          />
          {index < total - 1 && (
            <CardLayer
              key={`${index + 1}-next`}
              card={cards[index + 1]}
              active={false}
              offset={1}
              offsetY={offsetY}
            />
          )}
        </>
      ) : (
        <CardLayerEnd offsetY={offsetY} track={track} experience={experience} onRestart={() => jump(0)} />
      )}

      <ProgressDots count={total} current={Math.min(index, total - 1)} />

      <div className="pointer-events-none absolute right-0 bottom-[max(env(safe-area-inset-bottom),1.25rem)] left-0 z-20 flex justify-center">
        <span className="rounded-full border border-edge bg-background/60 px-3 py-1 font-mono text-[0.62rem] tracking-wide text-muted backdrop-blur">
          {atEnd
            ? `${experience.name} · complete`
            : `${String(Math.min(index + 1, total)).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
        </span>
      </div>
    </div>
  );
}

function CardLayer({
  card,
  active,
  offset,
  offsetY,
  onAnswer,
  onReplay,
  onInteract,
  onRank,
}: {
  card: Card;
  active: boolean;
  offset: number;
  offsetY: ReturnType<typeof useMotionValue<number>>;
  onAnswer?: (cardId: string, correct: boolean) => void;
  onReplay?: (cardId: string) => void;
  onInteract?: (cardId: string) => void;
  onRank?: (cardId: string, correct: boolean) => void;
}) {
  const y = useTransform(offsetY, (v) => `calc(${offset * 100}% + ${v}px)`);
  return (
    <motion.div
      className="absolute inset-0"
      style={{ y, willChange: "transform" }}
      data-offset={offset}
      aria-hidden={!active}
    >
      <CardRenderer
        card={card}
        active={active}
        onAnswer={onAnswer}
        onReplay={onReplay}
        onInteract={onInteract}
        onRank={onRank}
      />
    </motion.div>
  );
}

function CardLayerEnd({
  offsetY,
  track,
  experience,
  onRestart,
}: {
  offsetY: ReturnType<typeof useMotionValue<number>>;
  track: Track;
  experience: Experience;
  onRestart: () => void;
}) {
  const y = useTransform(offsetY, (v) => `calc(0% + ${v}px)`);
  return (
    <motion.div className="absolute inset-0" style={{ y, willChange: "transform" }}>
      <EndCard track={track} experience={experience} onRestart={onRestart} />
    </motion.div>
  );
}