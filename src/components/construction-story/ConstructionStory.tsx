"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArchitecturalHouse,
  type HouseStage,
} from "@/components/shared/ArchitecturalHouse";
import type { ProductId } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="lyseis"
      ref={rootRef}
      className="relative bg-[var(--ba-bg)]"
      aria-label="Η κατασκευή καθώς κάνετε scroll"
    >
      <div className="section-pad mx-auto grid max-w-[1400px] gap-8 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-3">Η κατασκευή συνεχίζεται</p>
          <ArchitecturalHouse
            stage={step.stage}
            progress={step.stage / 5}
            selected={step.selected}
            timeOfDay={step.time}
            showAnnotations={step.stage < 2}
            idPrefix="story"
          />
          <p className="mt-4 font-mono-arch text-sm tracking-[0.28em] text-[var(--ba-accent)]">
            {step.title}
          </p>
          <p className="body-lg mt-2 max-w-md text-[0.95rem]">{step.body}</p>
        </div>

        <div className="flex flex-col gap-[18vh] pb-10 pt-2 sm:gap-[26vh] sm:pb-[12vh] sm:pt-4 lg:gap-[32vh] lg:pb-[16vh]">
          {STEPS.map((s, i) => (
            <article
              key={s.id}
              data-story-step
              className={`max-w-lg border-l pl-4 transition-colors duration-500 sm:pl-5 ${
                i === active
                  ? "border-[var(--ba-accent)]"
                  : "border-[var(--ba-line)]"
              }`}
            >
              <p className="eyebrow mb-2">0{i + 1}</p>
              <h2 className="headline-md">{s.title}</h2>
              <p className="body-lg mt-3 text-[0.95rem]">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
