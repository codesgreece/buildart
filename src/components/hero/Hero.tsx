"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArchitecturalHouse } from "@/components/shared/ArchitecturalHouse";
import { MagneticLink } from "@/components/shared/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_PHYSICAL } from "@/lib/easing";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const parallaxX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const parallaxY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative min-h-[100svh] overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-24"
    >
      <div className="absolute inset-0 arch-grid opacity-30" />
      <div
        className="pointer-events-none absolute -right-24 top-20 h-[40vh] w-[40vh] rounded-full opacity-40 sm:h-[50vh] sm:w-[50vh]"
        style={{
          background:
            "radial-gradient(circle, var(--ba-accent-soft), transparent 70%)",
        }}
      />

      <div className="section-pad relative z-10 mx-auto grid max-w-[1400px] items-center gap-8 pb-20 sm:gap-10 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24 lg:pt-8">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_PHYSICAL }}
            className="eyebrow mb-4 sm:mb-6"
          >
            Θεσσαλονίκη · Από το 1985
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_PHYSICAL, delay: 0.08 }}
            className="font-display text-[clamp(2.75rem,14vw,8rem)] leading-[0.88] tracking-[-0.045em]"
          >
            BUILD
            <span className="text-[var(--ba-accent)]">ART</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE_PHYSICAL, delay: 0.18 }}
            className="mt-4 font-display text-[clamp(1.35rem,5vw,2.6rem)] leading-[1.15] tracking-tight sm:mt-6"
          >
            Από τα θεμέλια
            <br />
            μέχρι την ολοκλήρωση.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_PHYSICAL, delay: 0.28 }}
            className="body-lg mt-4 max-w-md text-[0.95rem] sm:mt-6"
          >
            Ολοκληρωμένες λύσεις κατασκευής, ανακαίνισης και ενεργειακής
            αναβάθμισης — με ποιότητα, τεχνική γνώση και υποστήριξη πριν και μετά
            την πώληση.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_PHYSICAL, delay: 0.38 }}
            className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap"
          >
            <MagneticLink href="#lyseis" className="w-full justify-center sm:w-auto">
              Ανακάλυψε τις λύσεις
            </MagneticLink>
            <MagneticLink
              href="#epikoinonia"
              variant="ghost"
              className="w-full justify-center sm:w-auto"
            >
              Ζήτησε προσφορά
            </MagneticLink>
          </motion.div>
        </div>

        <motion.div
          style={
            reduced
              ? undefined
              : { rotateX, rotateY, x: parallaxX, y: parallaxY, perspective: 1200 }
          }
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_PHYSICAL, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[520px] lg:max-w-[640px]"
        >
          <div className="absolute -inset-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(20,20,20,0.08),transparent_65%)]" />
          <ArchitecturalHouse
            progress={1}
            timeOfDay={0.32}
            selected={[
              "koufomata",
              "porta",
              "antlia",
              "iliakos",
              "kaminada",
              "klimatismos",
            ]}
            idPrefix="hero"
            className="drop-shadow-[0_40px_80px_rgba(20,20,20,0.14)]"
          />

          <div className="mt-4 flex items-center justify-between font-mono-arch text-[10px] tracking-[0.22em] uppercase text-[var(--ba-muted)]">
            <span>Residence / 01</span>
            <span>Complete system</span>
          </div>
        </motion.div>
      </div>

      <div className="section-pad absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-[1400px] items-end justify-between gap-4">
        <p className="max-w-[70%] font-mono-arch text-[9px] tracking-[0.2em] uppercase text-[var(--ba-muted)] sm:text-[10px] sm:tracking-[0.25em]">
          Scroll για να συνεχίσεις την κατασκευή
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="hidden h-10 w-px bg-[var(--ba-ink)] sm:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
