"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BuildartLogo } from "@/components/shared/BuildartLogo";
import { MagneticLink } from "@/components/shared/MagneticButton";
import { CONTACT, NAV_LINKS } from "@/data/products";
import { cn } from "@/lib/cn";
import { EASE_PHYSICAL } from "@/lib/easing";

export function Navigation({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!visible) return null;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_PHYSICAL, delay: 0.15 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-[var(--ba-line)] bg-[color-mix(in_srgb,var(--ba-bg)_88%,transparent)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="section-pad mx-auto flex h-14 max-w-[1400px] items-center justify-between sm:h-[4.25rem]">
          <a href="#hero" className="focus-ring min-h-11 min-w-11 touch-manipulation" aria-label="BUILDART αρχική">
            <BuildartLogo />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Κύρια πλοήγηση">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[0.72rem] tracking-[0.18em] uppercase text-[var(--ba-ink-soft)] transition-colors hover:text-[var(--ba-accent)] focus-ring"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--ba-accent)] transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${CONTACT.phone}`}
              className="focus-ring inline-flex min-h-11 touch-manipulation items-center gap-2 px-2 font-mono-arch text-[0.7rem] tracking-[0.12em] text-[var(--ba-ink-soft)] transition-colors hover:text-[var(--ba-accent)] sm:px-3 sm:text-[0.72rem] sm:tracking-[0.14em]"
              aria-label={`Κάλεσε στο ${CONTACT.phoneDisplay}`}
            >
              <PhoneIcon className="h-4 w-4 shrink-0 text-[var(--ba-accent)]" />
              <span className="hidden tabular-nums sm:inline">{CONTACT.phoneDisplay}</span>
            </a>

            <MagneticLink
              href="#epikoinonia"
              className="hidden !px-4 !py-2.5 sm:inline-flex"
            >
              Ζήτησε προσφορά
            </MagneticLink>

            <button
              type="button"
              className="relative flex h-11 w-11 touch-manipulation items-center justify-center focus-ring lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Μενού</span>
              <span
                className={cn(
                  "absolute h-px w-5 bg-[var(--ba-ink)] transition-transform duration-400",
                  open ? "rotate-45" : "-translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-5 bg-[var(--ba-ink)] transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-5 bg-[var(--ba-ink)] transition-transform duration-400",
                  open ? "-rotate-45" : "translate-y-1.5",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[var(--ba-bg)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:hidden"
          >
            <div className="section-pad flex min-h-full flex-col justify-center gap-1 py-24">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, ease: EASE_PHYSICAL }}
                  className="touch-manipulation border-b border-[var(--ba-line)] py-3.5 font-display text-[clamp(1.75rem,9vw,3.25rem)] tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={`tel:${CONTACT.phone}`}
                onClick={() => setOpen(false)}
                className="ba-button-ghost ba-button mt-4 w-full touch-manipulation justify-center focus-ring"
              >
                Κάλεσε {CONTACT.phoneDisplay}
              </a>
              <a
                href="#epikoinonia"
                onClick={() => setOpen(false)}
                className="ba-button mt-3 w-full touch-manipulation justify-center focus-ring sm:w-fit"
              >
                Ζήτησε προσφορά
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M7.5 3.75h3.2l1.1 4.2-2 1.2a12.5 12.5 0 0 0 5.05 5.05l1.2-2 4.2 1.1v3.2a1.75 1.75 0 0 1-1.75 1.75A15.75 15.75 0 0 1 2.75 5.5 1.75 1.75 0 0 1 4.5 3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
