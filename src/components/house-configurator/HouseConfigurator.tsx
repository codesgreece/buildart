"use client";

import { ArchitecturalHouse } from "@/components/shared/ArchitecturalHouse";
import { MagneticLink } from "@/components/shared/MagneticButton";
import { useSelection } from "@/context/SelectionContext";
import { PRODUCTS } from "@/data/products";
import { cn } from "@/lib/cn";

export function HouseConfigurator() {
  const { selected, toggle, count, isSelected } = useSelection();
  const ready = count > 0;

  return (
    <section
      id="xtise"
      className="relative border-t border-[var(--ba-line)] bg-[var(--ba-bg)] py-16 sm:py-20"
    >
      <div className="section-pad mx-auto max-w-[1400px]">
        <div className="mb-7 max-w-2xl sm:mb-8">
          <p className="eyebrow mb-2">Configurator</p>
          <h2 className="headline-lg">Χτίσε το σπίτι σου</h2>
          <p className="body-lg mt-2 text-[0.95rem]">Επίλεξε τι θέλεις να αναβαθμίσεις.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="relative">
            <ArchitecturalHouse
              progress={1}
              stage={5}
              selected={selected}
              timeOfDay={0.38}
              fireplaceLit={isSelected("tzaki") ? 0.7 : 0}
              idPrefix="config"
              className="drop-shadow-[0_20px_40px_rgba(20,20,20,0.1)]"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-mono-arch text-xs tracking-[0.18em] text-[var(--ba-muted)]">
                {count === 0
                  ? "Καμία λύση επιλεγμένη"
                  : count === 1
                    ? "1 λύση επιλεγμένη"
                    : `${count} λύσεις επιλεγμένες`}
              </p>
              {ready && (
                <p className="font-display text-base tracking-tight text-[var(--ba-accent)] sm:text-lg">
                  Το σπίτι σου είναι έτοιμο.
                </p>
              )}
            </div>
          </div>

          <div>
            <ul className="flex flex-col border-t border-[var(--ba-line)]">
              {PRODUCTS.map((product) => {
                const active = isSelected(product.id);
                return (
                  <li key={product.id} className="border-b border-[var(--ba-line)]">
                    <button
                      type="button"
                      onClick={() => toggle(product.id)}
                      aria-pressed={active}
                      className={cn(
                        "group flex w-full touch-manipulation items-center justify-between gap-3 py-3.5 text-left transition-colors focus-ring sm:gap-4 sm:py-3",
                        active ? "text-[var(--ba-ink)]" : "text-[var(--ba-muted)]",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center border transition-colors",
                            active
                              ? "border-[var(--ba-accent)] bg-[var(--ba-accent)] text-white"
                              : "border-[var(--ba-line-strong)]",
                          )}
                          aria-hidden
                        >
                          {active && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6.5 L4.5 9 L10 3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </span>
                        <span>
                          <span className="block font-display text-lg tracking-tight group-hover:text-[var(--ba-ink)] sm:text-xl">
                            {product.shortTitle}
                          </span>
                          <span className="mt-0.5 block text-sm text-[var(--ba-muted)]">
                            {product.title}
                          </span>
                        </span>
                      </span>
                      <span className="font-mono-arch text-[10px] tracking-[0.2em] uppercase opacity-50">
                        {active ? "ON" : "OFF"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <MagneticLink
                href="#epikoinonia"
                className={cn(!ready && "pointer-events-none opacity-40")}
                aria-disabled={!ready}
              >
                Ζήτησε προσφορά
              </MagneticLink>
              {!ready && (
                <p className="mt-2 text-sm text-[var(--ba-muted)]">
                  Επίλεξε τουλάχιστον μία λύση για να συνεχίσεις.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

