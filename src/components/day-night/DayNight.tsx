"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArchitecturalHouse } from "@/components/shared/ArchitecturalHouse";
import { EASE_PHYSICAL } from "@/lib/easing";

export function DayNight() {
  const [time, setTime] = useState(0.35);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTime(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  }, []);

  const label =
    time < 0.25
      ? "Πρωί"
      : time < 0.5
        ? "Μεσημέρι"
        : time < 0.75
          ? "Ηλιοβασίλεμα"
          : "Νύχτα";

  const night = time >= 0.78;

  return (
    <section className="relative overflow-hidden border-t border-[var(--ba-line)] py-16 sm:py-20">
      <div
        className="absolute inset-0 transition-[background] duration-500"
        style={{
          background:
            time < 0.3
              ? "linear-gradient(180deg, #d7e4ef, #f4f2ee 55%)"
              : time < 0.55
                ? "linear-gradient(180deg, #8eb4d0, #e8eef2 60%)"
                : time < 0.78
                  ? "linear-gradient(180deg, #e89b6a, #2a3040 70%)"
                  : "linear-gradient(180deg, #121824, #0b0f18 70%)",
        }}
      />

      <div className="section-pad relative z-10 mx-auto max-w-[1100px]">
        <div
          className={`mb-6 max-w-2xl transition-colors duration-500 sm:mb-7 ${
            time > 0.65 ? "text-white" : "text-[var(--ba-ink)]"
          }`}
        >
          <p className={`eyebrow mb-2 ${time > 0.65 ? "!text-white/50" : ""}`}>
            Ολοήμερη κατοικία
          </p>
          <h2 className="headline-lg">
            Από το πρωί
            <br />
            μέχρι το βράδυ.
          </h2>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <ArchitecturalHouse
            progress={1}
            timeOfDay={time}
            fireplaceLit={night ? 0.85 : 0}
            selected={[
              "koufomata",
              "porta",
              "antlia",
              "iliakos",
              "tzaki",
              "kaminada",
              "klimatismos",
            ]}
            idPrefix="daynight"
          />
        </div>

        <div className="mx-auto mt-6 max-w-xl sm:mt-7">
          <div className="mb-2 flex justify-between font-mono-arch text-[10px] tracking-[0.22em] uppercase">
            <span className={time > 0.65 ? "text-white/50" : "text-[var(--ba-muted)]"}>
              Πρωί
            </span>
            <span className={time > 0.65 ? "text-white" : "text-[var(--ba-ink)]"}>
              {label}
            </span>
            <span className={time > 0.65 ? "text-white/50" : "text-[var(--ba-muted)]"}>
              Νύχτα
            </span>
          </div>

          <div
            ref={trackRef}
            className="relative h-10 touch-none"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              update(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              update(e.clientX);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(time * 100)}
            aria-label="Ώρα της ημέρας"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setTime((t) => Math.max(0, t - 0.05));
              if (e.key === "ArrowRight") setTime((t) => Math.min(1, t + 0.05));
            }}
          >
            <div
              className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 ${
                time > 0.65 ? "bg-white/30" : "bg-[var(--ba-line-strong)]"
              }`}
            />
            {/* Sun handle */}
            <div
              className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                left: `${time * 100}%`,
                background:
                  time < 0.75
                    ? "radial-gradient(circle, #ffe08a, #f0a040)"
                    : "radial-gradient(circle, #d8e0f0, #8a9bb0)",
                borderColor: time > 0.65 ? "rgba(255,255,255,0.5)" : "var(--ba-ink)",
                boxShadow:
                  time < 0.75
                    ? "0 0 24px rgba(255,180,60,0.45)"
                    : "0 0 18px rgba(180,200,255,0.35)",
              }}
            />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: night ? 1 : 0, y: night ? 0 : 10 }}
          transition={{ duration: 0.7, ease: EASE_PHYSICAL }}
          className="mx-auto mt-7 max-w-lg text-center text-white sm:mt-8"
          aria-hidden={!night}
        >
          <p className="font-display text-[clamp(1.3rem,2.6vw,1.9rem)] tracking-tight">
            Ένα σπίτι.
            <br />
            Όλες οι λύσεις.
            <br />
            BUILDART.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
