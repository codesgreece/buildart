"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArchitecturalHouse,
  type HouseStage,
} from "@/components/shared/ArchitecturalHouse";
import type { ProductId } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_PHYSICAL } from "@/lib/easing";

gsap.registerPlugin(ScrollTrigger);

const STEPS: {
  id: string;
  title: string;
  body: string;
  stage: HouseStage;
  selected: ProductId[];
  time: number;
}[] = [
  {
    id: "themelia",
    title: "ΘΕΜΕΛΙΑ",
    body: "Κάθε έργο ξεκινά από τη βάση. Σταθερότητα, ακρίβεια, μέτρηση.",
    stage: 0,
    selected: [],
    time: 0.25,
  },
  {
    id: "domi",
    title: "ΔΟΜΗ",
    body: "Οι τοίχοι ορίζουν τον χώρο. Η κατοικία παίρνει μορφή.",
    stage: 1,
    selected: [],
    time: 0.3,
  },
  {
    id: "koufomata",
    title: "ΚΟΥΦΩΜΑΤΑ",
    body: "PVC συστήματα που κλείνουν τον χώρο με φως, ησυχία και μόνωση.",
    stage: 3,
    selected: ["koufomata"],
    time: 0.35,
  },
  {
    id: "thermanisi",
    title: "ΘΕΡΜΑΝΣΗ",
    body: "Αντλίες θερμότητας και λέβητες που δουλεύουν αθόρυβα στο παρασκήνιο.",
    stage: 4,
    selected: ["koufomata", "antlia", "leuitas"],
    time: 0.4,
  },
  {
    id: "klima",
    title: "ΚΛΙΜΑΤΙΣΜΟΣ",
    body: "Άνεση σε κάθε εποχή — με συστήματα που ταιριάζουν στον χώρο σου.",
    stage: 4,
    selected: ["koufomata", "antlia", "klimatismos"],
    time: 0.45,
  },
  {
    id: "energeia",
    title: "ΕΝΕΡΓΕΙΑ",
    body: "Ηλιακά, τζάκια και καμινάδες INOX — ολοκληρωμένη ενεργειακή εικόνα.",
    stage: 5,
    selected: ["koufomata", "antlia", "iliakos", "tzaki", "kaminada"],
    time: 0.55,
  },
  {
    id: "complete",
    title: "ΟΛΟΚΛΗΡΩΜΕΝΟ ΣΠΙΤΙ",
    body: "Ένα σπίτι. Όλες οι λύσεις. BUILDART.",
    stage: 5,
    selected: [
      "koufomata",
      "porta",
      "antlia",
      "leuitas",
      "klimatismos",
      "tzaki",
      "iliakos",
      "kaminada",
    ],
    time: 0.35,
  },
];

export function ConstructionStory() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  useEffect(() => {
    if (!rootRef.current || reduced) return;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]");

      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 35%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, rootRef);

    // Native mobile scroll needs a refresh after layout settles.
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 120);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      id="lyseis"
      ref={rootRef}
      className="relative bg-[var(--ba-bg)]"
      aria-label="Η κατασκευή καθώς κάνετε scroll"
    >
      <div className="section-pad mx-auto grid max-w-[1400px] gap-6 py-12 sm:gap-8 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-20">
        <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 self-start border-b border-[var(--ba-line)] bg-[var(--ba-bg)]/95 pb-4 backdrop-blur-sm sm:top-24 sm:border-b-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-none lg:top-24">
          <p className="eyebrow mb-2 sm:mb-3">Η κατασκευή συνεχίζεται</p>
          <ArchitecturalHouse
            stage={step.stage}
            progress={step.stage / 5}
            selected={step.selected}
            timeOfDay={step.time}
            showAnnotations={step.stage < 2}
            idPrefix="story"
            className="mx-auto max-h-[38vh] w-auto sm:max-h-none"
          />
          <p className="mt-3 font-mono-arch text-sm tracking-[0.28em] text-[var(--ba-accent)] sm:mt-4">
            {step.title}
          </p>
          <p className="body-lg mt-1.5 hidden max-w-md text-[0.95rem] sm:mt-2 sm:block">
            {step.body}
          </p>
        </div>

        <div className="flex flex-col gap-[28vh] pb-[20vh] pt-2 sm:gap-[30vh] sm:pb-[14vh] sm:pt-4 lg:gap-[34vh] lg:pb-[16vh]">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.id}
              data-story-step
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.45, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.55, ease: EASE_PHYSICAL }}
              className={`max-w-lg border-l pl-4 transition-colors duration-500 sm:pl-5 ${
                i === active
                  ? "border-[var(--ba-accent)]"
                  : "border-[var(--ba-line)]"
              }`}
            >
              <p className="eyebrow mb-2">0{i + 1}</p>
              <h2 className="headline-md">{s.title}</h2>
              <p className="body-lg mt-3 text-[0.95rem]">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
