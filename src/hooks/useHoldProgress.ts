"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseHoldProgressOptions {
  durationMs?: number;
  decayMs?: number;
  onComplete?: () => void;
  disabled?: boolean;
}

export function useHoldProgress({
  durationMs = 3200,
  decayMs = 1800,
  onComplete,
  disabled = false,
}: UseHoldProgressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const progressRef = useRef(0);
  const holdingRef = useRef(false);
  const completedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const durationRef = useRef(durationMs);
  const decayRef = useRef(decayMs);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    durationRef.current = durationMs;
    decayRef.current = decayMs;
  }, [durationMs, decayMs]);

  const ensureLoop = useCallback(() => {
    if (rafRef.current != null) return;

    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = Math.min(48, now - lastRef.current);
      lastRef.current = now;

      let next = progressRef.current;
      if (holdingRef.current && !completedRef.current) {
        next = Math.min(1, next + dt / durationRef.current);
      } else if (!completedRef.current) {
        next = Math.max(0, next - dt / decayRef.current);
      }

      progressRef.current = next;
      setProgress(next);

      if (next >= 1 && !completedRef.current) {
        completedRef.current = true;
        setCompleted(true);
        onCompleteRef.current?.();
      }

      if (!completedRef.current && (holdingRef.current || next > 0)) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        lastRef.current = null;
      }
    };

    lastRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (disabled || completedRef.current) return;
    holdingRef.current = true;
    setHolding(true);
    ensureLoop();
  }, [disabled, ensureLoop]);

  const stop = useCallback(() => {
    holdingRef.current = false;
    setHolding(false);
    if (!completedRef.current && progressRef.current > 0) ensureLoop();
  }, [ensureLoop]);

  const reset = useCallback(() => {
    completedRef.current = false;
    progressRef.current = 0;
    holdingRef.current = false;
    setProgress(0);
    setHolding(false);
    setCompleted(false);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { progress, holding, completed, start, stop, reset };
}
