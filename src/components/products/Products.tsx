"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { EASE_PHYSICAL } from "@/lib/easing";

const VISUAL: Record<
  string,
  { label: string; image: string; alt: string }
> = {
  koufomata: {
    label: "PVC SYSTEMS",
    image: "/images/products/koufomata.jpg",
    alt: "Εξωτερικά κουφώματα PVC σε σύγχρονη κατοικία",
  },
  porta: {
    label: "ARMORED",
    image: "/images/products/porta.jpg",
    alt: "Θωρακισμένη πόρτα εισόδου σε σύγχρονη πρόσοψη",
  },
  antlia: {
    label: "HEAT PUMP",
    image: "/images/products/antlia.jpg",
    alt: "Εξωτερική μονάδα αντλίας θερμότητας",
  },
  leuitas: {
    label: "GAS BOILER",
    image: "/images/products/leuitas.jpg",
    alt: "Επιτοίχιος λέβητας αερίου σε τεχνικό χώρο",
  },
  klimatismos: {
    label: "CLIMATE",
    image: "/images/products/klimatismos.jpg",
    alt: "Εσωτερική μονάδα κλιματιστικού σε σύγχρονο χώρο",
  },
  tzaki: {
    label: "FIREPLACE",
    image: "/images/products/tzaki.jpg",
    alt: "Ενεργειακό τζάκι σε καθιστικό",
  },
  iliakos: {
    label: "SOLAR",
    image: "/images/products/iliakos.jpg",
    alt: "Ηλιακός θερμοσίφωνας σε στέγη κατοικίας",
  },
  kaminada: {
    label: "INOX",
    image: "/images/products/kaminada.jpg",
    alt: "Καμινάδα INOX σε σύγχρονη κατοικία",
  },
};

export function Products() {
  return (
    <section className="relative border-t border-[var(--ba-line)] bg-[var(--ba-bg-elevated)] py-16 sm:py-20">
      <div className="section-pad mx-auto max-w-[1400px]">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="eyebrow mb-3">Μέρη του σπιτιού</p>
          <h2 className="headline-lg">Όλα όσα χρειάζεται το σπίτι σου.</h2>
          <p className="body-lg mt-3 text-[0.95rem]">
            Κάθε λύση είναι μέρος του ίδιου συστήματος — από τα ανοίγματα μέχρι
            την ενέργεια.
          </p>
        </div>

        <div className="flex flex-col">
          {PRODUCTS.map((product, i) => (
            <ProductRow key={product.id} index={i} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRow({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const visual = VISUAL[product.id];

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE_PHYSICAL, delay: 0.04 }}
      className="grid gap-4 border-t border-[var(--ba-line)] py-6 md:grid-cols-[0.15fr_1fr_0.75fr] md:items-center md:gap-8 md:py-7"
    >
      <p className="font-mono-arch text-xs tracking-[0.25em] text-[var(--ba-muted)]">
        {String(index + 1).padStart(2, "0")}
      </p>

      <div>
        <h3 className="font-display text-[clamp(1.35rem,2.6vw,2rem)] tracking-tight">
          {product.title}
        </h3>
        <p className="body-lg mt-2 max-w-md text-[0.92rem]">{product.description}</p>
        {product.brands && (
          <p className="mt-3 font-mono-arch text-[10px] tracking-[0.2em] uppercase text-[var(--ba-muted)]">
            {product.brands.join(" · ")}
          </p>
        )}
        {product.note && (
          <p className="mt-1.5 text-sm text-[var(--ba-accent)]">{product.note}</p>
        )}
      </div>

      <div className="group relative aspect-[16/9] overflow-hidden bg-[var(--ba-concrete)]">
        <Image
          src={visual.image}
          alt={visual.alt}
          fill
          sizes="(max-width: 768px) 100vw, 36vw"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="font-mono-arch text-[10px] tracking-[0.22em] text-white">
            {visual.label}
          </span>
          <span className="font-display text-2xl text-white/90">
            {product.shortTitle.slice(0, 1)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
