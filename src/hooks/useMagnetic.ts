"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    },
    [reduced, strength],
  );

  const onPointerLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
