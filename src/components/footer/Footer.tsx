"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArchitecturalHouse } from "@/components/shared/ArchitecturalHouse";
import { BuildartLogo } from "@/components/shared/BuildartLogo";
import { CONTACT, NAV_LINKS } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_PHYSICAL } from "@/lib/easing";

interface Debris {
  id: number;
  x: number;
  y: number;
  rot: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
}

export function Footer() {
  const reduced = usePrefersReducedMotion();
  const [demolished, setDemolished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ball, setBall] = useState(-40);
  const [debris, setDebris] = useState<Debris[]>([]);
  const animating = useRef(false);

  const demolish = () => {
    if (animating.current || demolished) return;
    if (reduced) {
      setDemolished(true);
      setProgress(1);
      return;
    }
    animating.current = true;
    setBall(-40);
    let frame = 0;
    const run = () => {
      frame += 1;
      const t = Math.min(1, frame / 45);
      setBall(-40 + t * 95);
      if (t >= 0.55) {
        setProgress(0.35);
        spawn();
      }
      if (t >= 0.85) {
        setProgress(1);
        setDemolished(true);
        animating.current = false;
        return;
      }
      requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };

  const spawn = () => {
    const batch: Debris[] = [];
    for (let i = 0; i < 18; i++) {
      batch.push({
        id: i,
        x: 45 + (Math.random() - 0.5) * 30,
        y: 40 + Math.random() * 20,
        rot: Math.random() * 40,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 3,
        w: 4 + Math.random() * 10,
        h: 3 + Math.random() * 6,
      });
    }
    setDebris(batch);
  };

  const debrisActive = debris.length > 0;

  useEffect(() => {
    if (!debrisActive) return;
    let raf = 0;
    let frames = 0;
    const loop = () => {
      frames += 1;
      setDebris((prev) =>
        prev.map((d) => ({
          ...d,
          x: d.x + d.vx * 0.4,
          y: d.y + d.vy * 0.4,
          vy: d.vy + 0.12,
          rot: d.rot + d.vx * 2,
        })),
      );
      if (frames < 50) raf = requestAnimationFrame(loop);
      else setDebris([]);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [debrisActive]);

  const rebuild = () => {
    setDemolished(false);
    setProgress(0);
    setBall(-40);
    setDebris([]);
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--ba-line)] bg-[var(--ba-bg)]">
      <AnimatePresence mode="wait">
        {!demolished ? (
          <motion.div
            key="intact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section-pad mx-auto max-w-[1400px] py-16"
          >
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_0.9fr]">
              <div>
                <BuildartLogo />
                <p className="mt-5 max-w-sm font-display text-2xl tracking-tight">
                  Από τα θεμέλια μέχρι την ολοκλήρωση.
                </p>
              </div>

              <nav aria-label="Υποσέλιδο">
                <p className="eyebrow mb-4">Πλοήγηση</p>
                <ul className="space-y-2">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="text-sm text-[var(--ba-muted)] transition-colors hover:text-[var(--ba-accent)] focus-ring"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <p className="eyebrow mb-4">Επικοινωνία</p>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="block text-sm hover:text-[var(--ba-accent)] focus-ring"
                >
                  {CONTACT.phoneDisplay}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-2 block text-sm hover:text-[var(--ba-accent)] focus-ring"
                >
                  {CONTACT.email}
                </a>
                <p className="mt-3 text-sm text-[var(--ba-muted)]">
                  {CONTACT.addressLine1}, {CONTACT.addressLine2}
                  <br />
                  {CONTACT.addressLine3}
                </p>
              </div>
            </div>

            <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[var(--ba-line)] pt-8 sm:flex-row sm:items-end">
              <p className="text-xs text-[var(--ba-muted)]">
                © {new Date().getFullYear()} BUILDART. Όλα τα δικαιώματα
                κατοχυρωμένα.
              </p>

              <div className="relative flex items-end gap-4">
                <p className="font-mono-arch text-[10px] tracking-[0.18em] uppercase text-[var(--ba-muted)]">
                  Μην πατήσεις το σπίτι.
                </p>
                <button
                  type="button"
                  onClick={demolish}
                  className="relative w-28 focus-ring"
                  aria-label="Μυστικό: κατεδάφιση υποσέλιδου"
                >
                  <ArchitecturalHouse
                    progress={1}
                    demolitionProgress={progress}
                    variant="footer"
                    idPrefix="footer-house"
                    selected={["koufomata", "porta"]}
                    className="opacity-80 transition-opacity hover:opacity-100"
                  />
                  {/* Wrecking ball */}
                  <motion.div
                    className="pointer-events-none absolute -top-2 left-1/2"
                    style={{ x: "-50%", y: `${ball}%` }}
                    aria-hidden
                  >
                    <svg width="28" height="40" viewBox="0 0 28 40">
                      <line
                        x1="14"
                        y1="0"
                        x2="14"
                        y2="18"
                        stroke="var(--ba-ink)"
                        strokeWidth="1.5"
                      />
                      <circle cx="14" cy="28" r="10" fill="var(--ba-ink)" />
                    </svg>
                  </motion.div>
                </button>
              </div>
            </div>

            {debris.map((d) => (
              <span
                key={d.id}
                className="pointer-events-none absolute bg-[var(--ba-ink)]"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: d.w,
                  height: d.h,
                  transform: `rotate(${d.rot}deg)`,
                  opacity: 0.7,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="rubble"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_PHYSICAL }}
            className="section-pad mx-auto flex min-h-[320px] max-w-[900px] flex-col items-center justify-center py-24 text-center"
          >
            <BuildartLogo />
            <p className="mt-8 font-display text-[clamp(1.8rem,4vw,3rem)] tracking-tight">
              Από τα θεμέλια
              <br />
              μέχρι την ολοκλήρωση.
            </p>
            <button
              type="button"
              onClick={rebuild}
              className="ba-button mt-10 focus-ring"
            >
              Ξανάχτισε το
            </button>

            <div className="mt-16 grid w-full gap-4 text-left sm:grid-cols-3">
              <a href={`tel:${CONTACT.phone}`} className="text-sm focus-ring">
                {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="text-sm focus-ring">
                {CONTACT.email}
              </a>
              <p className="text-sm text-[var(--ba-muted)]">
                {CONTACT.addressLine1}, {CONTACT.addressLine2}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
