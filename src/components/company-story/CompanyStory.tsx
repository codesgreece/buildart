"use client";

import { motion } from "framer-motion";
import { CONTACT } from "@/data/products";
import { EASE_PHYSICAL } from "@/lib/easing";

const MOMENTS = [
  {
    year: "1985",
    title: "Εκεί ξεκινά η ιστορία μας.",
    body: "Δεκαετίες εμπειρίας στην κατασκευή και στα υλικά του σπιτιού.",
  },
  {
    year: "2020",
    title: "Η BUILDART στη σημερινή της μορφή.",
    body: "Κατασκευαστική και εμπορική εταιρεία με ολοκληρωμένες λύσεις.",
  },
  {
    year: "Σήμερα",
    title: "Ολοκληρωμένες λύσεις για κάθε χώρο.",
    body: "Από τα θεμέλια μέχρι την ολοκλήρωση — με τεχνική καθοδήγηση και after-sales υποστήριξη.",
  },
];

export function CompanyStory() {
  return (
    <section
      id="istoria"
      className="relative overflow-hidden border-t border-[var(--ba-line)] bg-[var(--ba-bg-elevated)] py-16 sm:py-20"
    >
      <div className="section-pad mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="eyebrow mb-2">Η Buildart</p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE_PHYSICAL }}
              className="font-display text-[clamp(3.5rem,11vw,7rem)] leading-[0.85] tracking-[-0.05em]"
            >
              {CONTACT.founded}
            </motion.h2>
            <p className="mt-4 font-display text-xl tracking-tight sm:text-2xl">
              Εκεί ξεκινά η ιστορία μας.
            </p>
            <p className="body-lg mt-4 max-w-md text-[0.95rem]">
              Εμπειρία, αξιοπιστία και τεχνική γνώση. Χονδρικές τιμές, ποιοτικά
              προϊόντα γνωστών κατασκευαστών και υποστήριξη πριν και μετά την
              πώληση.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            {MOMENTS.map((m, i) => (
              <motion.article
                key={m.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, margin: "0px 0px -8% 0px" }}
                transition={{
                  duration: 0.65,
                  ease: EASE_PHYSICAL,
                  delay: 0.06 * i,
                }}
                className="border-l border-[var(--ba-line)] pl-5"
              >
                <p className="font-mono-arch text-sm tracking-[0.22em] text-[var(--ba-accent)]">
                  {m.year}
                </p>
                <h3 className="mt-1.5 font-display text-xl tracking-tight sm:text-2xl">
                  {m.title}
                </h3>
                <p className="body-lg mt-2 text-[0.92rem]">{m.body}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-3 border-t border-[var(--ba-line)] pt-7 sm:mt-14 sm:grid-cols-3 sm:gap-4 sm:pt-8">
          {[
            "Ποιότητα πριν και μετά την πώληση",
            "Γνωστοί κατασκευαστές",
            "Ολοκληρωμένες λύσεις κατοικίας",
          ].map((item) => (
            <p
              key={item}
              className="font-display text-lg tracking-tight text-[var(--ba-ink-soft)] sm:text-xl"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
