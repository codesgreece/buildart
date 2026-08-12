"use client";

import { useCallback, useRef, useState } from "react";
import { ArchitecturalHouse } from "@/components/shared/ArchitecturalHouse";
import type { ProductId } from "@/data/products";

const OLD_SELECTED: ProductId[] = [];
const NEW_SELECTED: ProductId[] = [
  "koufomata",
  "porta",
  "antlia",
  "iliakos",
  "klimatismos",
  "kaminada",
];

export function EnergyUpgrade() {
  const [ratio, setRatio] = useState(0.5);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setRatio(next);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const comfort = Math.round(ratio * 100);
  const loss = Math.round((1 - ratio) * 100);

  return (
    <section
      id="energeia"
      className="relative overflow-hidden border-t border-[var(--ba-line)] bg-[var(--ba-bg)] py-16 sm:py-20"
    >
      <div className="section-pad mx-auto max-w-[1200px]">
        <div className="mb-6 max-w-2xl sm:mb-8">
          <p className="eyebrow mb-2">Energy Upgrade</p>
          <h2 className="headline-lg">Δες το σπίτι σου να αλλάζει.</h2>
          <p className="body-lg mt-3 text-[0.95rem]">
            Σύγκρινε μια παλαιότερη κατάσταση με μια ενεργειακά αναβαθμισμένη
            πρόταση — χωρίς κατασκευασμένους αριθμούς, με ξεκάθαρη αίσθηση
            διαφοράς.
          </p>
        </div>

        <div
          ref={trackRef}
          className="relative aspect-[16/10] max-h-[min(52vh,420px)] w-full touch-none overflow-hidden border border-[var(--ba-line)] bg-[var(--ba-concrete)] select-none sm:aspect-[16/9]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          aria-label="Σύγκριση πριν και μετά ενεργειακής αναβάθμισης"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setRatio((r) => Math.max(0, r - 0.05));
            if (e.key === "ArrowRight") setRatio((r) => Math.min(1, r + 0.05));
          }}
        >
          {/* After (full) */}
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
            <ArchitecturalHouse
              progress={1}
              selected={NEW_SELECTED}
              timeOfDay={0.35}
              temperature={23}
              idPrefix="energy-new"
              className="max-h-full"
            />
            <span className="absolute right-3 top-3 font-mono-arch text-[10px] tracking-[0.22em] uppercase text-[var(--ba-accent)]">
              Ενεργειακά αναβαθμισμένο
            </span>
          </div>

          {/* Before (clipped) */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden p-3 sm:p-5"
            style={{
              clipPath: `inset(0 ${Math.round((1 - ratio) * 10000) / 100}% 0 0)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #9aadaf 0%, #c5b8a8 45%, #8a7e72 100%)",
              }}
            />
            {/* Thermal loss visualization */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, transparent, transparent 12px, rgba(220,80,60,0.18) 12px, rgba(220,80,60,0.18) 24px)",
              }}
            />
            <ArchitecturalHouse
              progress={0.55}
              stage={3}
              selected={OLD_SELECTED}
              timeOfDay={0.2}
              temperature={30}
              idPrefix="energy-old"
              className="relative z-10 max-h-full opacity-90"
            />
            <span className="absolute left-4 top-4 z-10 font-mono-arch text-[10px] tracking-[0.22em] uppercase text-[var(--ba-ink)]">
              Παλιό
            </span>
          </div>

          {/* Divider */}
          <div
            className="absolute inset-y-0 z-20 w-px bg-[var(--ba-ink)]"
            style={{ left: `${ratio * 100}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ba-ink)] bg-[var(--ba-bg)] shadow-lg">
              <span className="font-mono-arch text-[10px] tracking-wider">
                ⇆
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <Metric
            label="Θερμικές απώλειες"
            value={loss > 55 ? "Υψηλές" : loss > 30 ? "Μέτριες" : "Χαμηλές"}
            active={loss}
          />
          <Metric
            label="Άνεση"
            value={comfort > 70 ? "Υψηλή" : comfort > 40 ? "Μέτρια" : "Χαμηλή"}
            active={comfort}
          />
          <Metric
            label="Ενεργειακή απόδοση"
            value={
              ratio > 0.7 ? "Βελτιωμένη" : ratio > 0.4 ? "Μεταβατική" : "Παλαιά"
            }
            active={comfort}
          />
          <Metric
            label="Σύγχρονος εξοπλισμός"
            value={ratio > 0.55 ? "Ολοκληρωμένος" : "Ελλιπής"}
            active={comfort}
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: number;
}) {
  return (
    <div className="border border-[var(--ba-line)] px-2.5 py-2.5 sm:px-3 sm:py-3">
      <p className="eyebrow mb-1.5 text-[0.62rem] leading-tight sm:text-[0.7rem]">{label}</p>
      <p className="font-display text-base tracking-tight sm:text-lg">{value}</p>
      <div className="mt-2 h-px bg-[var(--ba-line)]">
        <div
          className="h-full bg-[var(--ba-accent)] transition-[width] duration-200"
          style={{ width: `${active}%` }}
        />
      </div>
    </div>
  );
}
