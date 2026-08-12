"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouchDevice();

  useEffect(() => {
    // Native scroll on touch / reduced motion — Lenis fights mobile scrolling.
    if (reduced || touch) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced, touch]);

  return <>{children}</>;
}
