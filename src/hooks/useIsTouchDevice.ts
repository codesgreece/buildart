"use client";

import { useEffect, useState } from "react";

/** True for phones/tablets with coarse pointer or no hover (touch-first). */
export function useIsTouchDevice() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const sync = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      setTouch(coarse || noHover);
    };
    sync();
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const hoverMq = window.matchMedia("(hover: none)");
    coarseMq.addEventListener("change", sync);
    hoverMq.addEventListener("change", sync);
    return () => {
      coarseMq.removeEventListener("change", sync);
      hoverMq.removeEventListener("change", sync);
    };
  }, []);

  return touch;
}
