"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_PHYSICAL } from "@/lib/easing";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    id: "s1",
    title: "Μελέτη",
    meta: ["Αυτοψία χώρου", "Καταγραφή αναγκών", "Τεχνική αξιολόγηση"],
    detail:
      "Ξεκινάμε με επιτόπια κατανόηση του χώρου και των στόχων σας — άνεση, εξοικονόμηση, ασφάλεια.",
  },
  {
    id: "s2",
    title: "Πρόταση",
    meta: ["Λύσεις ανά σύστημα", "Υλικά & brands", "Διαφανής προσφορά"],
    detail:
      "Σας παρουσιάζουμε σαφή πρόταση με επιλογές και κόστος, χωρίς εκπλήξεις στην πορεία.",
  },
  {
    id: "s3",
    title: "Υλοποίηση",
    meta: ["Προγραμματισμός", "Εγκατάσταση", "Συντονισμός συνεργείων"],
    detail:
      "Η εφαρμογή γίνεται με φροντίδα στη λεπτομέρεια, ώστε κάθε σύστημα να δουλεύει σωστά από την πρώτη μέρα.",
  },
  {
    id: "s4",
    title: "Παράδοση",
    meta: ["Τελικός έλεγχος", "Οδηγίες χρήσης", "Υποστήριξη μετά"],
    detail:
      "Παραδίδουμε ολοκληρωμένο αποτέλεσμα και μένουμε δίπλα σας για ό,τι χρειαστεί στη συνέχεια.",
  },
] as const;

function StepGlyph({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? "var(--ba-accent)" : "rgba(255,255,255,0.35)";
  const fill = active ? "rgba(10,158,199,0.12)" : "transparent";

  if (index === 0) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <rect x="18" y="22" width="84" height="76" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M18 48h84M42 22v76M78 22v76" fill="none" stroke={stroke} strokeWidth="1" opacity="0.55" />
        <circle cx="60" cy="64" r="7" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M60 57v-8M53 64h-8M67 64h8M60 71v8" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <rect x="28" y="18" width="64" height="84" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M40 36h40M40 50h40M40 64h28" stroke={stroke} strokeWidth="1.5" opacity="0.7" />
        <path d="M40 86h20" stroke={stroke} strokeWidth="2" />
        <circle cx="84" cy="86" r="10" fill="var(--ba-night)" stroke={stroke} strokeWidth="1.5" />
        <path d="M80 86l3 3 6-7" fill="none" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <path
          d="M24 86V42l36-20 36 20v44"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path d="M44 86V58h32v28" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M24 42h72" stroke={stroke} strokeWidth="1" opacity="0.45" />
        <path d="M60 22v20" stroke={stroke} strokeWidth="1" opacity="0.45" />
        <circle cx="68" cy="70" r="2.5" fill={stroke} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <rect x="36" y="16" width="48" height="88" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M44 28h32M44 40h32M44 52h20" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <circle cx="68" cy="72" r="4" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M68 76v10" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M78 54c8 4 12 12 12 22 0 14-10 24-22 28"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M86 88l-4 4 4 4" fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function DoorPortal({
  index,
  title,
  selected,
  onSelect,
}: {
  index: number;
  title: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Βήμα ${index + 1}: ${title}`}
      className={cn(
        "group relative flex min-h-[44px] w-full touch-manipulation flex-col items-center gap-1.5 focus-ring sm:gap-2",
        "min-w-0",
      )}
    >
      <div className="relative flex h-[96px] w-full max-w-[76px] items-end justify-center sm:h-[150px] sm:max-w-[110px]">
        {/* Portal frame */}
        <svg
          viewBox="0 0 100 160"
          className="h-full w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
          aria-hidden
        >
          <defs>
            <linearGradient id={`portal-glow-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={selected ? "#0a9ec7" : "#ffffff"} stopOpacity={selected ? 0.35 : 0.08} />
              <stop offset="100%" stopColor="#0e1218" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Outer arch */}
          <path
            d="M12 158 V48 C12 18 28 8 50 8 C72 8 88 18 88 48 V158"
            fill="none"
            stroke={selected ? "var(--ba-accent)" : "rgba(255,255,255,0.22)"}
            strokeWidth={selected ? 1.75 : 1.25}
          />
          {/* Inner door */}
          <path
            d="M22 158 V52 C22 28 34 20 50 20 C66 20 78 28 78 52 V158"
            fill={`url(#portal-glow-${index})`}
            stroke={selected ? "rgba(10,158,199,0.65)" : "rgba(255,255,255,0.14)"}
            strokeWidth="1"
          />
          {/* Panels */}
          <rect
            x="30"
            y="36"
            width="40"
            height="28"
            fill="none"
            stroke={selected ? "rgba(10,158,199,0.45)" : "rgba(255,255,255,0.12)"}
            strokeWidth="1"
          />
          <rect
            x="30"
            y="72"
            width="40"
            height="28"
            fill="none"
            stroke={selected ? "rgba(10,158,199,0.45)" : "rgba(255,255,255,0.12)"}
            strokeWidth="1"
          />
          <rect
            x="30"
            y="108"
            width="40"
            height="28"
            fill="none"
            stroke={selected ? "rgba(10,158,199,0.45)" : "rgba(255,255,255,0.12)"}
            strokeWidth="1"
          />
          {/* Handle */}
          <circle
            cx="70"
            cy="92"
            r="2.2"
            fill={selected ? "var(--ba-accent)" : "rgba(255,255,255,0.35)"}
          />
          {/* Floor threshold */}
          <path
            d="M8 158h84"
            stroke={selected ? "var(--ba-accent)" : "rgba(255,255,255,0.2)"}
            strokeWidth="1.5"
          />
        </svg>

        {/* Number badge */}
        <span
          className={cn(
            "absolute top-2 font-mono-arch text-[10px] tracking-[0.28em]",
            selected ? "text-[var(--ba-accent)]" : "text-white/35",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="text-center">
        <p
          className={cn(
            "font-display text-[0.95rem] tracking-tight transition-colors sm:text-lg",
            selected ? "text-white" : "text-white/45 group-hover:text-white/75",
          )}
        >
          {title}
        </p>
        <span
          className={cn(
            "mx-auto mt-1 block h-px w-6 transition-all duration-500 sm:mt-1.5 sm:w-8",
            selected ? "w-9 bg-[var(--ba-accent)] sm:w-11" : "bg-white/15 group-hover:bg-white/30",
          )}
        />
      </div>
    </button>
  );
}

export function PortfolioDoor() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section
      id="diadikasia"
      className="relative bg-[var(--ba-night)] py-12 text-white sm:py-14"
    >
      <div className="section-pad mx-auto max-w-[1100px]">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="door"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6, ease: EASE_PHYSICAL }}
              className="mx-auto max-w-3xl"
            >
              <div className="mb-4 text-center sm:mb-5">
                <p className="eyebrow mb-1.5 !text-white/45">Διαδικασία</p>
                <h2 className="font-display text-[clamp(1.55rem,3.2vw,2.35rem)] leading-[1.1] tracking-[-0.03em] text-white">
                  Πίσω από κάθε πόρτα υπάρχει μια σαφής πορεία.
                </h2>
              </div>

              <button
                type="button"
                className="group relative mx-auto flex h-[180px] w-full max-w-md touch-manipulation items-center justify-center overflow-hidden border border-white/10 focus-ring sm:h-[240px] sm:max-w-xl"
                onClick={() => setOpen(true)}
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHover({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height,
                  });
                }}
                aria-label="Άνοιξε την πόρτα για να δεις τη διαδικασία BUILDART"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, #0a0c10 0%, #161a22 18%, #1c222c 50%, #161a22 82%, #0a0c10 100%),
                      linear-gradient(180deg, #12161c, #0a0c10)
                    `,
                  }}
                />
                <div className="absolute inset-0 arch-grid opacity-20" />

                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${hover.x * 100}% ${hover.y * 100}%, rgba(255,255,255,0.12), transparent 35%)`,
                  }}
                />

                <motion.div
                  className="relative z-10 h-[78%] w-[28%] min-w-[110px] max-w-[140px] border border-white/20 bg-[#151a22]"
                  style={{
                    boxShadow: `
                      inset ${-20 + hover.x * 40}px 0 40px rgba(255,255,255,${0.03 + hover.x * 0.04}),
                      0 16px 40px rgba(0,0,0,0.45)
                    `,
                  }}
                  whileHover={{ scale: 1.015 }}
                >
                  <div className="absolute inset-2.5 grid grid-rows-3 gap-1.5 sm:inset-3 sm:gap-2">
                    <div className="border border-white/10" />
                    <div className="border border-white/10" />
                    <div className="border border-white/10" />
                  </div>
                  <div className="absolute right-3 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full bg-[var(--ba-accent)] shadow-[0_0_16px_rgba(10,158,199,0.35)]" />
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 font-mono-arch text-[8px] tracking-[0.28em] text-white/35">
                    BUILDART
                  </div>
                </motion.div>

                <span className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 font-mono-arch text-[10px] tracking-[0.32em] uppercase text-white/70 transition-colors group-hover:text-[var(--ba-accent)] sm:bottom-4">
                  Άνοιξε
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="process"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE_PHYSICAL }}
            >
              <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="eyebrow mb-2 !text-white/45">Η διαδικασία μας</p>
                  <h2 className="font-display text-[clamp(1.5rem,5vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-white">
                    Μελέτη → Παράδοση
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ba-button-light ba-button focus-ring !px-4 !py-2.5 touch-manipulation self-start sm:self-auto"
                >
                  Κλείσε την πόρτα
                </button>
              </div>

              {/* Corridor of portals */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-[6%] top-[36%] hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent sm:block sm:top-[40%]" />
                <motion.div
                  className="pointer-events-none absolute top-[36%] hidden h-px bg-[var(--ba-accent)] sm:block sm:top-[40%]"
                  initial={{ width: "0%", left: "6%" }}
                  animate={{
                    width: `${(active / Math.max(STEPS.length - 1, 1)) * 88}%`,
                    left: "6%",
                  }}
                  transition={{ duration: 0.55, ease: EASE_PHYSICAL }}
                  style={{
                    boxShadow: "0 0 18px rgba(10,158,199,0.45)",
                  }}
                />

                <div className="relative z-10 grid grid-cols-2 gap-3 sm:flex sm:items-end sm:justify-between sm:gap-3">
                  {STEPS.map((s, i) => (
                    <motion.div
                      key={s.id}
                      className="min-w-0 sm:flex-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 * i,
                        duration: 0.55,
                        ease: EASE_PHYSICAL,
                      }}
                    >
                      <DoorPortal
                        index={i}
                        title={s.title}
                        selected={active === i}
                        onSelect={() => setActive(i)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active step detail — compact, no cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE_PHYSICAL }}
                  className="relative mt-7 grid items-center gap-5 border-t border-white/10 pt-6 sm:grid-cols-[96px_1fr] sm:gap-8"
                >
                  <div className="mx-auto h-20 w-20 sm:mx-0 sm:h-24 sm:w-24">
                    <StepGlyph index={active} active />
                  </div>

                  <div>
                    <p className="font-mono-arch text-[10px] tracking-[0.28em] text-[var(--ba-accent)]">
                      ΒΗΜΑ {String(active + 1).padStart(2, "0")} / 04
                    </p>
                    <h3 className="mt-1.5 font-display text-[clamp(1.6rem,3.5vw,2.35rem)] leading-[1] tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-[0.95rem]">
                      {step.detail}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {step.meta.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 font-mono-arch text-[10px] tracking-[0.14em] uppercase text-white/45"
                        >
                          <span className="h-1 w-1 rounded-full bg-[var(--ba-accent)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
