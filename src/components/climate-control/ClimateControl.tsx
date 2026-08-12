"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_PHYSICAL } from "@/lib/easing";

const TEMPS = [32, 30, 28, 26, 24, 22] as const;
const BRANDS = ["SAMSUNG", "TOYOTOMI", "GREE", "DAIKIN", "MIDEA", "TCL"];

export function ClimateControl() {
  const [temp, setTemp] = useState(32);
  const dragging = useRef(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const idx = TEMPS.indexOf(temp as (typeof TEMPS)[number]);
  const comfort = Math.max(0, Math.min(1, (32 - temp) / 10));
  const revealed = temp <= 22;

  const setFromAngle = useCallback((clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - cy, clientX - cx);
    // Map -PI..PI to 0..1 around bottom-heavy arc
    let t = (angle + Math.PI) / (Math.PI * 2);
    t = (t + 0.25) % 1;
    const i = Math.round(t * (TEMPS.length - 1));
    setTemp(TEMPS[Math.max(0, Math.min(TEMPS.length - 1, i))]);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromAngle(e.clientX, e.clientY);
  };

  return (
    <section
      className="relative overflow-hidden py-16 transition-[background] duration-700 sm:py-20"
      style={{
        background: `color-mix(in srgb, #f4f2ee ${40 + comfort * 60}%, #e8a060)`,
      }}
    >
      {/* Heat haze / cool calm overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: 1 - comfort,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,140,60,0.25), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: comfort,
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(140,200,230,0.28), transparent 55%)",
        }}
      />

      {/* Airflow particles */}
      {comfort > 0.4 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[var(--ba-accent)]/40"
              style={{ left: `${8 + i * 7}%`, top: `${30 + (i % 5) * 10}%` }}
              animate={{ x: [0, 40 + i * 3], opacity: [0, 0.6, 0] }}
              transition={{
                duration: 2.4 + i * 0.15,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="section-pad relative z-10 mx-auto max-w-[1100px]">
        <div className="mb-7 text-center sm:mb-8">
          <p className="eyebrow mb-2">Κλιματισμός</p>
          <h2 className="headline-lg">Ρύθμισε την ατμόσφαιρα.</h2>
          <p className="body-lg mx-auto mt-2 max-w-lg text-[0.95rem]">
            Περιστρέψε τον θερμοστάτη. Ο χώρος ακολουθεί.
          </p>
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center">
          <div
            ref={dialRef}
            className="relative h-52 w-52 touch-none select-none sm:h-60 sm:w-60"
            onPointerDown={onPointerDown}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              setFromAngle(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
            role="slider"
            aria-valuemin={22}
            aria-valuemax={32}
            aria-valuenow={temp}
            aria-label="Θερμοκρασία χώρου"
            tabIndex={0}
            onKeyDown={(e) => {
              const i = TEMPS.indexOf(temp as (typeof TEMPS)[number]);
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                setTemp(TEMPS[Math.max(0, i - 1)]);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                setTemp(TEMPS[Math.min(TEMPS.length - 1, i + 1)]);
              }
            }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle
                cx="100"
                cy="100"
                r="84"
                fill="none"
                stroke="var(--ba-line-strong)"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="var(--ba-bg-elevated)"
                stroke="var(--ba-ink)"
                strokeWidth="1.5"
              />
              {TEMPS.map((t, i) => {
                const a = (i / (TEMPS.length - 1)) * Math.PI * 1.4 - Math.PI * 0.7;
                const x = 100 + Math.cos(a) * 78;
                const y = 100 + Math.sin(a) * 78;
                return (
                  <circle
                    key={t}
                    cx={x}
                    cy={y}
                    r={t === temp ? 4 : 2}
                    fill={t === temp ? "var(--ba-accent)" : "var(--ba-muted)"}
                  />
                );
              })}
              <line
                x1="100"
                y1="100"
                x2={
                  100 +
                  Math.cos(
                    (idx / (TEMPS.length - 1)) * Math.PI * 1.4 - Math.PI * 0.7,
                  ) *
                    48
                }
                y2={
                  100 +
                  Math.sin(
                    (idx / (TEMPS.length - 1)) * Math.PI * 1.4 - Math.PI * 0.7,
                  ) *
                    48
                }
                stroke="var(--ba-ink)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="6" fill="var(--ba-accent)" />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl tracking-tight sm:text-5xl">{temp}°</span>
              <span className="mt-0.5 font-mono-arch text-[10px] tracking-[0.2em] text-[var(--ba-muted)]">
                CELSIUS
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
            {TEMPS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemp(t)}
                className={`min-h-10 min-w-10 touch-manipulation focus-ring px-2 py-1.5 font-mono-arch text-xs tracking-wider ${
                  t === temp
                    ? "text-[var(--ba-accent)]"
                    : "text-[var(--ba-muted)]"
                }`}
              >
                {t}°
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            y: revealed ? 0 : 12,
          }}
          transition={{ duration: 0.8, ease: EASE_PHYSICAL }}
          className="mx-auto mt-8 max-w-xl text-center sm:mt-10"
          aria-hidden={!revealed}
        >
          <p className="font-display text-[clamp(1.3rem,2.6vw,1.9rem)] tracking-tight">
            Η σωστή θερμοκρασία
            <br />
            αλλάζει όλο τον χώρο.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {BRANDS.map((b) => (
              <span
                key={b}
                className="font-mono-arch text-[10px] tracking-[0.22em] text-[var(--ba-muted)]"
              >
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
