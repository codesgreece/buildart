"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArchitecturalHouse,
  progressToStage,
} from "@/components/shared/ArchitecturalHouse";
import { BuildartLogo } from "@/components/shared/BuildartLogo";
import { useHoldProgress } from "@/hooks/useHoldProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_PHYSICAL } from "@/lib/easing";

interface ConstructionLoaderProps {
  onComplete: () => void;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  blur: number;
  rot: number;
  vr: number;
  kind: "grit" | "cloud";
  tone: number;
}

export function ConstructionLoader({ onComplete }: ConstructionLoaderProps) {
  const reduced = usePrefersReducedMotion();
  const [exiting, setExiting] = useState(false);
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<DustParticle[]>([]);
  const [impactFlash, setImpactFlash] = useState(0);
  const particleId = useRef(0);
  const lastImpactAt = useRef(0);
  const hammerAngle = useRef(0);
  const [hammer, setHammer] = useState(0);
  const finishedRef = useRef(false);
  const particlesActive = particles.length > 0;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setExiting(true);
    window.setTimeout(() => onComplete(), reduced ? 200 : 1400);
  }, [onComplete, reduced]);

  const { progress, holding, start, stop, completed } = useHoldProgress({
    durationMs: reduced ? 400 : 3400,
    decayMs: 1600,
    onComplete: finish,
    disabled: exiting,
  });

  const stage = progressToStage(progress);
  const pct = Math.round(progress * 100);

  const spawnDust = useCallback((force: number) => {
    const batch: DustParticle[] = [];
    const gritCount = Math.min(22, 10 + Math.floor(force * 14));
    const cloudCount = Math.min(10, 4 + Math.floor(force * 6));
    const originX = 50 + (Math.random() - 0.5) * 10;
    const originY = 62 + (Math.random() - 0.5) * 6;

    for (let i = 0; i < gritCount; i++) {
      particleId.current += 1;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = 1.2 + Math.random() * 4.2 * force;
      const maxLife = 0.7 + Math.random() * 0.55;
      batch.push({
        id: particleId.current,
        x: originX + (Math.random() - 0.5) * 14,
        y: originY + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed * (0.6 + Math.random()),
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: 1.2 + Math.random() * 3.2,
        blur: Math.random() * 0.6,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 18,
        kind: "grit",
        tone: Math.random(),
      });
    }

    for (let i = 0; i < cloudCount; i++) {
      particleId.current += 1;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      const speed = 0.6 + Math.random() * 1.8 * force;
      const maxLife = 1 + Math.random() * 0.8;
      batch.push({
        id: particleId.current,
        x: originX + (Math.random() - 0.5) * 20,
        y: originY + Math.random() * 4,
        vx: Math.cos(angle) * speed * 0.7,
        vy: Math.sin(angle) * speed - 0.4,
        life: maxLife,
        maxLife,
        size: 18 + Math.random() * 34 * force,
        blur: 6 + Math.random() * 10,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 8,
        kind: "cloud",
        tone: Math.random(),
      });
    }

    setParticles((prev) => [...prev.slice(-70), ...batch]);
    setImpactFlash(1);
    window.setTimeout(() => setImpactFlash(0), 180);
  }, []);

  useEffect(() => {
    if (!holding || completed || reduced) return;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      hammerAngle.current += dt * 0.014;
      const swing = Math.sin(hammerAngle.current);
      setHammer(swing);

      // Strike at bottom of swing
      if (swing > 0.88 && now - lastImpactAt.current > 200) {
        lastImpactAt.current = now;
        setShake({
          x: (Math.random() - 0.5) * 7,
          y: 3,
        });
        spawnDust(0.75 + progress * 0.55);
        window.setTimeout(() => setShake({ x: 0, y: 0 }), 110);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [holding, completed, reduced, spawnDust, progress]);

  useEffect(() => {
    if (!particlesActive) return;
    let raf = 0;
    const loop = () => {
      setParticles((prev) =>
        prev
          .map((p) => {
            const t = 1 - p.life / p.maxLife;
            const drag = p.kind === "cloud" ? 0.22 : 0.38;
            const lift = p.kind === "cloud" ? -0.035 : 0.07;
            return {
              ...p,
              x: p.x + p.vx * drag,
              y: p.y + p.vy * drag,
              vx: p.vx * (p.kind === "cloud" ? 0.985 : 0.992),
              vy: p.vy + lift + (p.kind === "grit" ? 0.09 : 0.01),
              life: p.life - (p.kind === "cloud" ? 0.016 : 0.026),
              size: p.kind === "cloud" ? p.size * (1 + 0.012) : p.size,
              rot: p.rot + p.vr * (0.4 + t),
              blur: p.kind === "cloud" ? p.blur + 0.08 : p.blur,
            };
          })
          .filter((p) => p.life > 0),
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [particlesActive]);

  useEffect(() => {
    if (!reduced) return;
    const t = window.setTimeout(() => {
      finish();
    }, 600);
    return () => window.clearTimeout(t);
  }, [reduced, finish]);

  const stageLabel = useMemo(() => {
    if (stage <= 0) return "Θεμέλια";
    if (stage === 1) return "Δομή";
    if (stage === 2) return "Στέγη";
    if (stage === 3) return "Ανοίγματα";
    if (stage === 4) return "Λεπτομέρειες";
    return "Ολοκλήρωση";
  }, [stage]);

  const bindHold = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      start();
    },
    onPointerUp: stop,
    onPointerCancel: stop,
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex touch-none select-none flex-col items-center justify-center overflow-hidden overscroll-none"
        style={{ background: "var(--ba-bg)", WebkitUserSelect: "none" }}
        initial={{ opacity: 1 }}
        animate={
          exiting
            ? { opacity: 0, scale: 1.08, filter: "blur(8px)" }
            : {
                opacity: 1,
                x: shake.x,
                y: shake.y,
              }
        }
        transition={{ duration: exiting ? 1.2 : 0.08, ease: EASE_PHYSICAL }}
        {...bindHold}
        role="dialog"
        aria-modal="true"
        aria-label="Εμπειρία φόρτωσης κατασκευής BUILDART"
      >
        <div className="noise-overlay" />
        <div className="absolute inset-0 arch-grid opacity-40" />

        <div className="pointer-events-none absolute inset-x-4 top-[max(1.5rem,env(safe-area-inset-top))] flex justify-between gap-2 text-[9px] tracking-[0.18em] text-[var(--ba-muted)] font-mono-arch uppercase sm:inset-x-8 sm:top-10 sm:text-[10px] sm:tracking-[0.25em]">
          <span>BUILDART / 1985</span>
          <span className="truncate">{stageLabel}</span>
          <span>{String(pct).padStart(3, "0")}%</span>
        </div>

        <div className="relative w-full max-w-[720px] px-4 sm:px-6">
          <motion.div
            animate={{
              rotate: holding ? hammer * -42 : -12,
              y: holding ? Math.max(0, hammer) * 14 : 0,
              x: holding ? Math.max(0, hammer) * 6 : 0,
            }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            style={{ transformOrigin: "28% 78%" }}
            className="pointer-events-none absolute right-2 top-0 z-20 sm:-right-1 sm:top-4 md:right-6"
            aria-hidden
          >
            <div className="scale-[0.72] sm:scale-100">
              <HammerIcon active={holding} striking={holding && hammer > 0.7} />
            </div>
          </motion.div>

          <ArchitecturalHouse
            progress={reduced ? 1 : progress}
            timeOfDay={0.28}
            idPrefix="loader"
            showAnnotations={progress < 0.4}
            className="mx-auto drop-shadow-[0_30px_60px_rgba(20,20,20,0.12)]"
          />

          {/* Impact dust burst at foundation */}
          <div
            className="pointer-events-none absolute left-1/2 top-[62%] z-10 -translate-x-1/2"
            style={{
              width: 220,
              height: 120,
              opacity: impactFlash,
              transition: "opacity 160ms ease-out",
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(180,160,130,0.45), rgba(160,140,110,0.12) 45%, transparent 70%)",
              filter: "blur(2px)",
            }}
          />

          {/* Dust particles */}
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {particles.map((p) => {
              const fade = Math.max(0, p.life / p.maxLife);
              const dust =
                p.tone > 0.55
                  ? `rgba(156, 140, 118, ${fade * (p.kind === "cloud" ? 0.35 : 0.75)})`
                  : p.tone > 0.25
                    ? `rgba(176, 162, 140, ${fade * (p.kind === "cloud" ? 0.4 : 0.7)})`
                    : `rgba(120, 110, 95, ${fade * (p.kind === "cloud" ? 0.28 : 0.65)})`;

              return (
                <span
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.kind === "cloud" ? p.size * 0.62 : p.size * 0.75,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    borderRadius: p.kind === "cloud" ? "50%" : "2px",
                    background: dust,
                    opacity: fade,
                    filter: `blur(${p.blur}px)`,
                    transform: `rotate(${p.rot}deg) scale(${
                      p.kind === "cloud" ? 1 + (1 - fade) * 0.85 : 1
                    })`,
                    boxShadow:
                      p.kind === "cloud"
                        ? `0 0 ${p.size * 0.35}px ${dust}`
                        : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

          <div className="mt-6 flex flex-col items-center gap-3 px-4 text-center sm:mt-8 sm:px-6">
          {!completed ? (
            <>
              <p className="hold-hint text-[var(--ba-ink)]">
                Κράτησε πατημένο για να χτίσεις
              </p>
              <p className="body-lg max-w-md text-sm">
                Κάθε χτύπημα χτίζει το σπίτι. Κράτα πατημένο μέχρι την ολοκλήρωση.
              </p>
              <div className="mt-2 h-[2px] w-40 overflow-hidden bg-[var(--ba-line)]">
                <motion.div
                  className="h-full bg-[var(--ba-accent)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <BuildartLogo />
              <p className="font-display text-xl tracking-tight sm:text-2xl">
                Από τα θεμέλια μέχρι την ολοκλήρωση.
              </p>
            </motion.div>
          )}
        </div>

        {reduced && (
          <button
            type="button"
            className="ba-button mt-8 touch-manipulation focus-ring"
            onClick={finish}
          >
            Είσοδος
          </button>
        )}

        <button
          type="button"
          className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 min-h-11 touch-manipulation px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-[var(--ba-muted)] focus-ring sm:right-6"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
        >
          Παράλειψη
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function HammerIcon({
  active,
  striking,
}: {
  active: boolean;
  striking: boolean;
}) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
      <g
        opacity={active ? 1 : 0.7}
        style={{
          filter: striking
            ? "drop-shadow(0 4px 6px rgba(20,20,20,0.25))"
            : undefined,
        }}
      >
        {/* Handle */}
        <path
          d="M34 82 L58 28"
          stroke="#6b4a2e"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M34 82 L58 28"
          stroke="#8b6340"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M36.2 78 L57 32"
          stroke="rgba(255,220,180,0.28)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Metal neck */}
        <path
          d="M54 34 L62 22"
          stroke="#7a828a"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Hammer head — claw + face */}
        <path
          d="M48 14
             C46 10 48 8 52 8
             L68 8
             C74 8 78 12 78 18
             C78 22 76 24 72 26
             L64 30
             L58 34
             L52 28
             C46 24 46 18 48 14 Z"
          fill="#3a4048"
          stroke="#1a1c1f"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Face bevel */}
        <path
          d="M68 10 L74 12 C76 14 76 18 74 20 L70 24"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Claw split */}
        <path
          d="M52 12 C50 16 50 20 52 24"
          fill="none"
          stroke="#1a1c1f"
          strokeWidth="1.2"
        />
        <path
          d="M50 10 L46 18 L50 26"
          fill="none"
          stroke="#2a3036"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Striking spark */}
        {striking && (
          <g opacity="0.9">
            <circle cx="76" cy="22" r="3" fill="#f0d080" />
            <path
              d="M78 18 L86 10 M80 24 L90 26 M76 28 L78 36"
              stroke="#e8c060"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
