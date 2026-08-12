"use client";

import { cn } from "@/lib/cn";
import type { ProductId } from "@/data/products";

export type HouseStage = 0 | 1 | 2 | 3 | 4 | 5;

export function progressToStage(progress: number): HouseStage {
  if (progress < 0.2) return 0;
  if (progress < 0.4) return 1;
  if (progress < 0.6) return 2;
  if (progress < 0.8) return 3;
  if (progress < 1) return 4;
  return 5;
}

export interface ArchitecturalHouseProps {
  progress?: number;
  stage?: HouseStage;
  className?: string;
  timeOfDay?: number;
  temperature?: number;
  selected?: ProductId[];
  showAnnotations?: boolean;
  demolished?: boolean;
  demolitionProgress?: number;
  fireplaceLit?: number;
  variant?: "default" | "blueprint" | "minimal" | "footer";
  idPrefix?: string;
}

/** Point on left roof plane (t: 0 at eave → 1 at ridge) */
function leftRoof(t: number, across = 0) {
  // Left roof triangle: eave (205,248) → ridge (430,118), depth toward facade (228,248)→(430,148)
  const eaveX = 205 + across * 22;
  const eaveY = 248;
  const ridgeX = 430;
  const ridgeY = 118 + across * 30;
  return {
    x: eaveX + (ridgeX - eaveX) * t,
    y: eaveY + (ridgeY - eaveY) * t,
  };
}

/** Point on right roof plane */
function rightRoof(t: number, across = 0) {
  const eaveX = 655 - across * 22;
  const eaveY = 248;
  const ridgeX = 430;
  const ridgeY = 118 + across * 30;
  return {
    x: eaveX + (ridgeX - eaveX) * t,
    y: eaveY + (ridgeY - eaveY) * t,
  };
}

export function ArchitecturalHouse({
  progress = 1,
  stage,
  className,
  timeOfDay = 0.35,
  temperature = 24,
  selected = [],
  showAnnotations = false,
  demolished = false,
  demolitionProgress = 0,
  fireplaceLit = 0,
  variant = "default",
  idPrefix = "house",
}: ArchitecturalHouseProps) {
  const s = stage ?? progressToStage(progress);
  const has = (id: ProductId) => selected.includes(id) || progress >= 1;
  const night = timeOfDay;
  const cool = Math.max(0, Math.min(1, (temperature - 22) / 10));
  const d = demolished ? demolitionProgress : 0;
  const isBlueprint = variant === "blueprint";
  const isFooter = variant === "footer";
  const isMinimal = variant === "minimal";

  const stroke = isBlueprint ? "var(--ba-accent)" : "#1a1c1f";
  const frame = has("koufomata") ? "var(--ba-accent)" : "#2a2e32";

  const glass =
    night > 0.65
      ? `rgba(255, 210, 130, ${0.48 + fireplaceLit * 0.3})`
      : has("koufomata")
        ? "rgba(145, 195, 215, 0.48)"
        : "rgba(165, 175, 185, 0.22)";

  const sky =
    night < 0.3
      ? ["#d4e3ee", "#eef2f4"]
      : night < 0.55
        ? ["#7fa7c4", "#c3d3de"]
        : night < 0.75
          ? ["#de8958", "#2b3343"]
          : ["#141b28", "#070a10"];

  // Solar collector parallelogram flush on left roof
  const solar = {
    a: leftRoof(0.22, 0.15),
    b: leftRoof(0.22, 0.72),
    c: leftRoof(0.58, 0.72),
    d: leftRoof(0.58, 0.15),
  };
  const tankA = leftRoof(0.6, 0.28);
  const tankB = leftRoof(0.6, 0.62);
  const tankDir = { x: tankB.x - tankA.x, y: tankB.y - tankA.y };
  const tankN = { x: -tankDir.y * 0.12, y: tankDir.x * 0.12 };

  // Chimney base on right roof
  const chimBase = rightRoof(0.42, 0.45);
  const chimTop = { x: chimBase.x + 4, y: chimBase.y - 58 };

  return (
    <svg
      viewBox="0 0 860 640"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label="Αρχιτεκτονική απεικόνιση κατοικίας BUILDART"
    >
      <defs>
        <linearGradient id={`${idPrefix}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f958a" />
          <stop offset="100%" stopColor="#4e554e" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-wall`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#f1ece5" />
          <stop offset="100%" stopColor="#d8d1c6" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-wallShade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(40,32,24,0.1)" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4149" />
          <stop offset="100%" stopColor="#1e2328" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-inox`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8e979e" />
          <stop offset="45%" stopColor="#d7dde1" />
          <stop offset="100%" stopColor="#6d767d" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-collector`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#245a7a" />
          <stop offset="100%" stopColor="#0f3044" />
        </linearGradient>
        <radialGradient id={`${idPrefix}-fire`} cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#FFE8A0" stopOpacity={fireplaceLit} />
          <stop offset="50%" stopColor="#FF8A3D" stopOpacity={fireplaceLit * 0.75} />
          <stop offset="100%" stopColor="#FF4D1A" stopOpacity={0} />
        </radialGradient>
        <filter id={`${idPrefix}-soft`}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id={`${idPrefix}-glow`}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id={`${idPrefix}-facade`}>
          <path d="M220 468 V262 L430 140 L640 262 V468 Z" />
        </clipPath>
      </defs>

      {!isFooter && !isBlueprint && !isMinimal && (
        <rect
          width="860"
          height="640"
          fill={`url(#${idPrefix}-sky)`}
          opacity={0.93 - cool * 0.1}
        />
      )}

      {!isFooter && !isBlueprint && s >= 0 && (
        <path
          d="M40 465 C180 442 280 452 400 445 C540 436 640 452 760 445 L820 465 V515 H40 Z"
          fill={night > 0.7 ? "rgba(16,24,32,0.3)" : "rgba(105,115,102,0.24)"}
        />
      )}

      <path
        d="M70 505 H790 L740 568 H120 Z"
        fill={isBlueprint ? "none" : `url(#${idPrefix}-ground)`}
        stroke={isBlueprint ? stroke : "none"}
        strokeWidth={1.2}
        opacity={s >= 0 ? 1 - d * 0.5 : 0.15}
        style={{ transform: `translateY(${d * 30}px)`, transformOrigin: "430px 535px" }}
      />

      {!isBlueprint && s >= 1 && (
        <ellipse
          cx="430"
          cy="500"
          rx="200"
          ry="14"
          fill="rgba(0,0,0,0.14)"
          filter={`url(#${idPrefix}-soft)`}
        />
      )}

      {/* Foundation / plinth */}
      <g
        opacity={s >= 0 ? 1 : 0.2}
        style={{
          transform: `translate(${d * -16}px, ${d * 36}px)`,
          transformOrigin: "430px 485px",
        }}
      >
        <rect
          x="208"
          y="468"
          width="444"
          height="22"
          fill={isBlueprint ? "none" : "#3a3f3c"}
          stroke={stroke}
          strokeWidth={1.2}
        />
        <rect x="208" y="486" width="444" height="6" fill={isBlueprint ? "none" : "#2a2f2c"} />
        {showAnnotations && (
          <text
            x="430"
            y="536"
            textAnchor="middle"
            fill="var(--ba-muted)"
            fontSize="11"
            letterSpacing="0.2em"
            fontFamily="ui-monospace, monospace"
          >
            ΘΕΜΕΛΙΑ
          </text>
        )}
      </g>

      <g opacity={s >= 0 ? (s < 1 ? 0.4 : 0.1) : 0.1} stroke={stroke} fill="none">
        <polyline
          points="220,468 220,262 430,140 640,262 640,468"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
      </g>

      {/* Facade */}
      <g
        opacity={s >= 1 ? 1 : 0}
        style={{
          transform: `translateY(${s >= 1 ? d * 40 : 60}px)`,
          transformOrigin: "430px 340px",
          transition: "opacity 0.4s ease",
        }}
      >
        <path
          d="M220 468 V262 L430 140 L640 262 V468 Z"
          fill={isBlueprint ? "none" : `url(#${idPrefix}-wall)`}
          stroke={stroke}
          strokeWidth={1.4}
          opacity={isBlueprint ? 0.35 : 1}
        />
        {!isBlueprint && (
          <>
            <path
              d="M220 468 V262 L430 140 L640 262 V468 Z"
              fill={`url(#${idPrefix}-wallShade)`}
            />
            <g clipPath={`url(#${idPrefix}-facade)`} opacity="0.2">
              {[300, 340, 380, 420, 450].map((y) => (
                <line
                  key={y}
                  x1="230"
                  y1={y}
                  x2="630"
                  y2={y}
                  stroke="rgba(70,55,40,0.18)"
                />
              ))}
            </g>
          </>
        )}
      </g>

      {/* Roof */}
      <g
        opacity={s >= 2 ? 1 : 0}
        style={{
          transform: `translateY(${s >= 2 ? d * -28 : -48}px)`,
          transformOrigin: "430px 160px",
        }}
      >
        <path
          d="M185 258 L430 112 L675 258 L640 258 L430 148 L220 258 Z"
          fill={isBlueprint ? "none" : "#1a1e22"}
          stroke={stroke}
          strokeWidth={1}
        />
        <path
          d="M198 250 L430 118 L662 250 L640 250 L430 148 L220 250 Z"
          fill={isBlueprint ? "none" : `url(#${idPrefix}-roof)`}
          stroke={stroke}
          strokeWidth={1.2}
        />
        {!isBlueprint && (
          <>
            <path d="M430 118 L662 250 L640 250 L430 148 Z" fill="rgba(255,255,255,0.05)" />
            <path d="M220 250 L430 148 L430 118 L198 250 Z" fill="rgba(0,0,0,0.22)" />
            {/* Tile courses following pitch */}
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => {
              const l0 = leftRoof(t, 0.05);
              const l1 = leftRoof(t, 0.95);
              const r0 = rightRoof(t, 0.05);
              const r1 = rightRoof(t, 0.95);
              return (
                <g key={t} stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                  <line x1={l0.x} y1={l0.y} x2={l1.x} y2={l1.y} />
                  <line x1={r0.x} y1={r0.y} x2={r1.x} y2={r1.y} />
                </g>
              );
            })}
            <line x1="430" y1="118" x2="430" y2="128" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          </>
        )}
      </g>

      {/* Solar — flush parallelogram + tank on same plane */}
      <g opacity={has("iliakos") ? 1 : 0}>
        <polygon
          points={`${solar.a.x},${solar.a.y} ${solar.b.x},${solar.b.y} ${solar.c.x},${solar.c.y} ${solar.d.x},${solar.d.y}`}
          fill={isBlueprint ? "none" : `url(#${idPrefix}-collector)`}
          stroke={stroke}
          strokeWidth={1.2}
        />
        {!isBlueprint && (
          <>
            {[0.25, 0.5, 0.75].map((t) => {
              const p0 = {
                x: solar.a.x + (solar.b.x - solar.a.x) * t,
                y: solar.a.y + (solar.b.y - solar.a.y) * t,
              };
              const p1 = {
                x: solar.d.x + (solar.c.x - solar.d.x) * t,
                y: solar.d.y + (solar.c.y - solar.d.y) * t,
              };
              return (
                <line
                  key={t}
                  x1={p0.x}
                  y1={p0.y}
                  x2={p1.x}
                  y2={p1.y}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="1"
                />
              );
            })}
            {/* Frame edge highlight */}
            <polyline
              points={`${solar.a.x},${solar.a.y} ${solar.d.x},${solar.d.y} ${solar.c.x},${solar.c.y}`}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          </>
        )}
        {/* Tank across slope, just above collector */}
        <path
          d={`
            M ${tankA.x + tankN.x} ${tankA.y + tankN.y}
            L ${tankB.x + tankN.x} ${tankB.y + tankN.y}
            L ${tankB.x - tankN.x} ${tankB.y - tankN.y}
            L ${tankA.x - tankN.x} ${tankA.y - tankN.y}
            Z
          `}
          fill={isBlueprint ? "none" : "#e7ebef"}
          stroke={stroke}
          strokeWidth={1.1}
        />
        {!isBlueprint && (
          <line
            x1={tankA.x}
            y1={tankA.y}
            x2={tankB.x}
            y2={tankB.y}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="3"
          />
        )}
      </g>

      {/* INOX chimney — rooted on right roof plane */}
      <g opacity={has("kaminada") || (progress >= 0.85 && s >= 4) ? 1 : 0}>
        {/* Flashing diamond on roof */}
        <ellipse
          cx={chimBase.x}
          cy={chimBase.y}
          rx="16"
          ry="7"
          fill={isBlueprint ? "none" : "#2f353c"}
          stroke={stroke}
          strokeWidth={1}
        />
        <rect
          x={chimTop.x - 7}
          y={chimTop.y}
          width="14"
          height={chimBase.y - chimTop.y}
          rx="2"
          fill={isBlueprint ? "none" : `url(#${idPrefix}-inox)`}
          stroke={stroke}
          strokeWidth={1.1}
        />
        {!isBlueprint && (
          <line
            x1={chimTop.x - 2}
            y1={chimTop.y + 6}
            x2={chimTop.x - 2}
            y2={chimBase.y - 4}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
        )}
        <rect
          x={chimTop.x - 10}
          y={chimTop.y - 4}
          width="20"
          height="8"
          rx="1"
          fill={isBlueprint ? "none" : "#c2c9ce"}
          stroke={stroke}
          strokeWidth={1}
        />
        <path
          d={`M ${chimTop.x - 12} ${chimTop.y - 2} L ${chimTop.x} ${chimTop.y - 10} L ${chimTop.x + 12} ${chimTop.y - 2}`}
          fill={isBlueprint ? "none" : "#aeb6bc"}
          stroke={stroke}
          strokeWidth={1}
        />
        {/* Soft smoke when fireplace lit */}
        {fireplaceLit > 0.2 && !isBlueprint && (
          <g opacity={fireplaceLit * 0.45} filter={`url(#${idPrefix}-soft)`}>
            <circle cx={chimTop.x} cy={chimTop.y - 18} r="5" fill="rgba(220,225,230,0.5)" />
            <circle cx={chimTop.x + 6} cy={chimTop.y - 28} r="7" fill="rgba(220,225,230,0.35)" />
          </g>
        )}
      </g>

      {/* Windows — mirrored */}
      <g opacity={s >= 3 ? 1 : 0}>
        {[248, 522].map((x) => (
          <g key={x} opacity={has("koufomata") || s >= 3 ? 1 : 0.32}>
            <rect
              x={x - 4}
              y={298}
              width="96"
              height="118"
              fill={isBlueprint ? "none" : "#eef2f4"}
              stroke={has("koufomata") ? frame : stroke}
              strokeWidth={has("koufomata") ? 2 : 1.15}
            />
            <rect x={x} y={302} width="88" height="110" fill={glass} stroke={stroke} strokeWidth={0.8} />
            <line x1={x + 44} y1={302} x2={x + 44} y2={412} stroke={stroke} strokeWidth={0.9} opacity={0.35} />
            <line x1={x} y1={357} x2={x + 88} y2={357} stroke={stroke} strokeWidth={0.9} opacity={0.35} />
            {!isBlueprint && (
              <path
                d={`M${x + 7} 308 V370`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
                opacity={night > 0.65 ? 0.1 : 0.35}
              />
            )}
            <rect
              x={x - 7}
              y={412}
              width="102"
              height="5"
              fill={isBlueprint ? "none" : "#c2bbb1"}
              stroke={stroke}
              strokeWidth={0.6}
            />
          </g>
        ))}
      </g>

      {/* Door */}
      <g opacity={s >= 3 ? 1 : 0}>
        <rect
          x="400"
          y="348"
          width="60"
          height="120"
          fill={has("porta") ? "#121820" : isBlueprint ? "none" : "#2a3037"}
          stroke={has("porta") ? "var(--ba-accent)" : stroke}
          strokeWidth={has("porta") ? 2 : 1.15}
        />
        {!isBlueprint && (
          <>
            <rect x="408" y="360" width="44" height="42" fill="none" stroke="rgba(255,255,255,0.08)" />
            <rect x="408" y="412" width="44" height="42" fill="none" stroke="rgba(255,255,255,0.08)" />
          </>
        )}
        <circle cx="448" cy="410" r="2.8" fill={has("porta") ? "var(--ba-accent)" : "#c2a36a"} />
        <rect
          x="392"
          y="464"
          width="76"
          height="6"
          fill={isBlueprint ? "none" : "#434944"}
          stroke={stroke}
          strokeWidth={0.6}
        />
      </g>

      {/* Interior fireplace glow — only through glass, no facade box */}
      {(has("tzaki") || fireplaceLit > 0) && fireplaceLit > 0 && !isBlueprint && (
        <ellipse
          cx="572"
          cy="390"
          rx="28"
          ry="34"
          fill={`url(#${idPrefix}-fire)`}
          opacity={0.85}
          clipPath={`url(#${idPrefix}-facade)`}
        />
      )}

      {/* Wall AC — flush on left facade beside window */}
      <g opacity={has("klimatismos") ? 1 : 0}>
        <rect
          x="222"
          y="328"
          width="22"
          height="40"
          rx="2"
          fill={isBlueprint ? "none" : "#e4e8eb"}
          stroke={stroke}
          strokeWidth={1}
        />
        {!isBlueprint && (
          <>
            <line x1="226" y1="338" x2="240" y2="338" stroke="#8a9298" strokeWidth="1.3" />
            <line x1="226" y1="345" x2="240" y2="345" stroke="#8a9298" strokeWidth="1.3" />
            <line x1="226" y1="352" x2="240" y2="352" stroke="#8a9298" strokeWidth="1.3" />
          </>
        )}
      </g>

      {/* Outdoor plant: heat pump (+ optional boiler as slim companion) */}
      <g opacity={has("antlia") || has("leuitas") ? 1 : 0}>
        {!isBlueprint && (
          <path d="M672 476 H790 L780 492 H682 Z" fill="#7f8580" opacity="0.9" />
        )}
        <g opacity={has("antlia") ? 1 : 0}>
          <rect
            x="682"
            y="422"
            width="58"
            height="54"
            rx="3"
            fill={isBlueprint ? "none" : "#2c3238"}
            stroke={stroke}
            strokeWidth={1.1}
          />
          {!isBlueprint && (
            <>
              <circle cx="711" cy="448" r="16" fill="#181d22" stroke="#505860" strokeWidth="1.4" />
              <circle cx="711" cy="448" r="9" fill="none" stroke="#626c76" />
              <circle cx="711" cy="448" r="2.5" fill="#6e7882" />
              <rect x="688" y="428" width="46" height="4" rx="1" fill="#3c444c" />
            </>
          )}
        </g>
        <g opacity={has("leuitas") ? 1 : 0}>
          <rect
            x="750"
            y="436"
            width="26"
            height="40"
            rx="2"
            fill={isBlueprint ? "none" : "#dde2e6"}
            stroke={stroke}
            strokeWidth={1}
          />
          {!isBlueprint && (
            <rect x="755" y="443" width="16" height="8" rx="1" fill="rgba(10,158,199,0.3)" />
          )}
        </g>
      </g>

      {night > 0.6 && !isBlueprint && !isFooter && (
        <ellipse
          cx="430"
          cy="360"
          rx="160"
          ry="100"
          fill={`rgba(255, 196, 110, ${(night - 0.6) * 0.28 + fireplaceLit * 0.18})`}
          filter={`url(#${idPrefix}-glow)`}
          pointerEvents="none"
        />
      )}

      {(showAnnotations || isBlueprint) && (
        <g stroke="var(--ba-muted)" strokeWidth={0.8} opacity={0.5}>
          <line x1="168" y1="140" x2="168" y2="468" />
          <line x1="160" y1="140" x2="176" y2="140" />
          <line x1="160" y1="468" x2="176" y2="468" />
          <text
            x="146"
            y="310"
            fill="var(--ba-muted)"
            fontSize="10"
            letterSpacing="0.14em"
            fontFamily="ui-monospace, monospace"
            transform="rotate(-90 146 310)"
          >
            3.40m
          </text>
        </g>
      )}
    </svg>
  );
}
