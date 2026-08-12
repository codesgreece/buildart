"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useHoldProgress } from "@/hooks/useHoldProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_PHYSICAL } from "@/lib/easing";

export function Fireplace() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lit, setLit] = useState(false);
  const { progress, holding, start, stop, completed } = useHoldProgress({
    durationMs: reduced ? 400 : 2200,
    decayMs: 1100,
    onComplete: () => setLit(true),
  });

  const warmth = reduced ? 1 : lit ? 1 : progress;

  useEffect(() => {
    if (reduced) setLit(true);
  }, [reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const intensity = Math.max(warmth, progress);
      if (intensity <= 0.02) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const cx = w * 0.5;
      const baseY = h * 0.92;

      // Soft hearth glow
      const glow = ctx.createRadialGradient(cx, baseY, 4, cx, baseY - h * 0.2, h * 0.85);
      glow.addColorStop(0, `rgba(255,150,50,${0.22 + intensity * 0.35})`);
      glow.addColorStop(0.45, `rgba(255,100,30,${0.08 + intensity * 0.12})`);
      glow.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const tongues = 9;
      for (let i = 0; i < tongues; i++) {
        const n = (i - (tongues - 1) / 2) / ((tongues - 1) / 2);
        const offset = n * w * 0.28;
        const phase = t * (1.7 + i * 0.12) + i * 0.9;
        const height =
          h *
          (0.42 + intensity * 0.48) *
          (0.55 + 0.45 * Math.sin(phase * 0.85)) *
          (1 - Math.abs(n) * 0.28);
        const width = w * (0.08 + intensity * 0.05) * (0.7 + Math.sin(phase) * 0.15);

        const grad = ctx.createLinearGradient(cx + offset, baseY, cx + offset, baseY - height);
        grad.addColorStop(0, `rgba(255, 90, 20, ${0.35 + intensity * 0.45})`);
        grad.addColorStop(0.35, `rgba(255, 150, 40, ${0.35 + intensity * 0.4})`);
        grad.addColorStop(0.7, `rgba(255, 220, 120, ${0.2 + intensity * 0.28})`);
        grad.addColorStop(1, "rgba(255, 250, 220, 0)");

        ctx.beginPath();
        ctx.moveTo(cx + offset - width * 0.5, baseY);
        ctx.bezierCurveTo(
          cx + offset - width * 0.85,
          baseY - height * 0.3,
          cx + offset + Math.sin(phase) * width * 0.35,
          baseY - height * 0.62,
          cx + offset + Math.sin(phase * 1.25) * width * 0.15,
          baseY - height,
        );
        ctx.bezierCurveTo(
          cx + offset + width * 0.25,
          baseY - height * 0.58,
          cx + offset + width * 0.75,
          baseY - height * 0.28,
          cx + offset + width * 0.5,
          baseY,
        );
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Hot core
      const core = ctx.createRadialGradient(cx, baseY - 8, 2, cx, baseY - 8, w * 0.18);
      core.addColorStop(0, `rgba(255,240,180,${0.35 + intensity * 0.4})`);
      core.addColorStop(0.5, `rgba(255,160,50,${0.15 + intensity * 0.2})`);
      core.addColorStop(1, "rgba(255,100,20,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(cx, baseY - 6, w * 0.22, h * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < Math.floor(4 + intensity * 14); i++) {
        const ex = cx + Math.sin(t * 1.8 + i * 2.3) * (w * 0.08 + i * 2.2);
        const ey = baseY - 10 - ((t * 28 + i * 19) % (h * (0.35 + intensity * 0.45)));
        ctx.fillStyle = `rgba(255, 190, 90, ${0.2 + intensity * 0.45})`;
        ctx.beginPath();
        ctx.arc(ex, ey, 1 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [progress, reduced, warmth]);

  const bind = {
    onPointerDown: (e: React.PointerEvent) => {
      if (completed || reduced) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      start();
    },
    onPointerUp: stop,
    onPointerCancel: stop,
  };

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20"
      style={{
        background: `color-mix(in srgb, #12161c ${72 - warmth * 18}%, #3a2014)`,
        color: `color-mix(in srgb, #e8e2d8 ${100 - warmth * 25}%, #ffe6c4)`,
      }}
      aria-label="Ενεργειακά τζάκια"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: 0.12 + warmth * 0.55,
          background:
            "radial-gradient(ellipse 70% 55% at 70% 70%, rgba(255,120,40,0.35), transparent 70%)",
        }}
      />
      <div className="noise-overlay opacity-[0.04]" />

      <div className="section-pad relative z-10 mx-auto max-w-[1200px]">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div>
            <p className="eyebrow mb-2 !text-current/45">Ενεργειακά τζάκια</p>
            <h2 className="headline-lg text-current">
              Ζεστασιά
              <br />
              με χαρακτήρα.
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-current/60">
              Τζάκια απλής και ενεργειακής καύσης — ελληνικής κατασκευής και
              εισαγόμενα. Επιλέγουμε λύσεις που ταιριάζουν στον χώρο σου.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {["Απλή καύση", "Ενεργειακή καύση", "Ελληνικά & εισαγωγής"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-mono-arch text-[10px] tracking-[0.16em] uppercase text-current/45"
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{
                        background: `color-mix(in srgb, var(--ba-ember) ${40 + warmth * 60}%, currentColor)`,
                      }}
                    />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <motion.p
              initial={false}
              animate={{
                opacity: lit || reduced ? 1 : 0.35,
              }}
              transition={{ duration: 0.7, ease: EASE_PHYSICAL }}
              className="mt-7 font-display text-xl tracking-tight text-current/80 sm:text-2xl"
            >
              {lit || reduced
                ? "Ζεστασιά που αλλάζει τον χώρο."
                : "Άναψε τη φωτιά για να το νιώσεις."}
            </motion.p>
          </div>

          <div
            {...bind}
            className="group relative mx-auto w-full max-w-lg touch-none select-none focus-ring lg:max-w-none"
            role="button"
            tabIndex={0}
            aria-label={
              completed || reduced
                ? "Τζάκι αναμμένο"
                : "Κράτησε πατημένο για να ανάψεις τη φωτιά"
            }
            onKeyDown={(e) => {
              if (completed || reduced) return;
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                start();
              }
            }}
            onKeyUp={stop}
          >
            <div
              className="relative aspect-[5/4] overflow-hidden"
              style={{
                background: `
                  linear-gradient(180deg,
                    #1a1f28 0%,
                    color-mix(in srgb, #1c1612 ${70 - warmth * 20}%, #2a1810) 55%,
                    color-mix(in srgb, #241810 ${60 - warmth * 25}%, #3a2010) 100%)
                `,
                boxShadow: `
                  inset 0 0 80px rgba(0,0,0,0.35),
                  0 24px 60px rgba(0,0,0,${0.25 + warmth * 0.2})
                `,
              }}
            >
              {/* Room side light wash */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: warmth,
                  background:
                    "radial-gradient(ellipse at 50% 78%, rgba(255,140,50,0.22), transparent 52%)",
                }}
              />

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 640 520"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                <defs>
                  <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a342e" />
                    <stop offset="100%" stopColor="#2a2420" />
                  </linearGradient>
                  <linearGradient id="mantel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a433c" />
                    <stop offset="100%" stopColor="#2e2924" />
                  </linearGradient>
                  <linearGradient id="firebox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a0806" />
                    <stop offset="100%" stopColor="#16110c" />
                  </linearGradient>
                  <radialGradient id="innerGlow" cx="50%" cy="85%" r="55%">
                    <stop
                      offset="0%"
                      stopColor={`rgba(255,140,50,${0.15 + warmth * 0.55})`}
                    />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>

                {/* Floor */}
                <path
                  d="M40 470 H600 L560 510 H80 Z"
                  fill={`rgba(30,24,18,${0.55 + warmth * 0.15})`}
                />

                {/* Outer surround */}
                <rect
                  x="120"
                  y="70"
                  width="400"
                  height="400"
                  fill="url(#stone)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                {/* Stone joint lines */}
                <path
                  d="M120 170 H520 M120 270 H520 M120 370 H520 M220 70 V470 M420 70 V470"
                  stroke="rgba(0,0,0,0.22)"
                  strokeWidth="1"
                />

                {/* Mantel shelf */}
                <rect x="95" y="55" width="450" height="28" fill="url(#mantel)" />
                <rect
                  x="95"
                  y="78"
                  width="450"
                  height="6"
                  fill="rgba(255,255,255,0.06)"
                />

                {/* Inner frame */}
                <rect
                  x="168"
                  y="150"
                  width="304"
                  height="268"
                  fill="#1a1511"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1.5"
                />

                {/* Firebox opening */}
                <rect x="188" y="172" width="264" height="220" fill="url(#firebox)" />
                <rect x="188" y="172" width="264" height="220" fill="url(#innerGlow)" />

                {/* Hearth ledge */}
                <rect x="155" y="418" width="330" height="22" fill="#322c26" />
                <rect
                  x="155"
                  y="418"
                  width="330"
                  height="3"
                  fill={`rgba(255,160,60,${warmth * 0.25})`}
                />

                {/* Logs */}
                <ellipse
                  cx="320"
                  cy="372"
                  rx="78"
                  ry="12"
                  fill="#1a120c"
                  opacity={0.9}
                />
                <rect
                  x="255"
                  y="348"
                  width="70"
                  height="18"
                  rx="8"
                  fill="#2a1c12"
                  transform="rotate(-12 290 357)"
                />
                <rect
                  x="315"
                  y="350"
                  width="72"
                  height="16"
                  rx="8"
                  fill="#23180f"
                  transform="rotate(10 351 358)"
                />

                {/* Glass reflection hint */}
                <path
                  d="M200 180 V360"
                  stroke={`rgba(255,220,180,${0.04 + warmth * 0.08})`}
                  strokeWidth="18"
                />
              </svg>

              {/* Flame layer — clipped to firebox */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: "29.4%",
                  top: "33.1%",
                  width: "41.25%",
                  height: "42.3%",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  aria-hidden
                />
                {reduced && (
                  <div
                    className="absolute inset-x-[10%] bottom-0 top-[20%]"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 90%, rgba(255,160,50,0.7), rgba(255,90,20,0.25) 45%, transparent 70%)",
                    }}
                  />
                )}
              </div>

              {!completed && !reduced && (
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <p className="hold-hint text-white/85">
                    {holding ? "Ανάβει…" : "Κράτησε πατημένο"}
                  </p>
                  <div className="mx-auto mt-2.5 h-px w-28 overflow-hidden bg-white/15">
                    <div
                      className="h-full bg-[var(--ba-ember)] transition-[width] duration-75"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {holding && !completed && (
                <div className="pointer-events-none absolute inset-0 bg-[rgba(255,120,40,0.04)]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
