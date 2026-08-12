"use client";

import { useMemo, useState } from "react";
import { useSelection } from "@/context/SelectionContext";
import { CONTACT, PRODUCTS } from "@/data/products";
import { cn } from "@/lib/cn";

interface FormState {
  name: string;
  phone: string;
  email: string;
  area: string;
  message: string;
}

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  area: "",
  message: "",
};

export function Quote() {
  const { selected, toggle, isSelected } = useSelection();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

  const interests = useMemo(
    () => PRODUCTS.filter((p) => selected.includes(p.id)),
    [selected],
  );

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Το όνομα είναι υποχρεωτικό.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Συμπλήρωσε έγκυρο τηλέφωνο.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Μη έγκυρο email.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus("error");
      return;
    }

    // Frontend-only integration point — no backend yet.
    // Replace with API / form service when available.
    const payload = {
      ...form,
      interests: interests.map((i) => i.id),
      interestLabels: interests.map((i) => i.title),
    };
    console.info("[BUILDART quote payload]", payload);
    setStatus("ready");
  };

  return (
    <section
      id="epikoinonia"
      className="relative border-t border-[var(--ba-line)] bg-[var(--ba-ink)] py-16 text-[var(--ba-bg)] sm:py-20"
    >
      <div className="section-pad mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div>
          <p className="eyebrow mb-2 !text-white/45">Επικοινωνία</p>
          <h2 className="headline-lg text-white">
            Πες μας τι θέλεις να χτίσουμε.
          </h2>
          <p className="mt-3 max-w-md text-white/55">
            Συμπλήρωσε τα στοιχεία σου. Οι επιλογές από τον configurator έχουν
            ήδη μεταφερθεί.
          </p>

          <div className="mt-7 space-y-4 font-mono-arch text-sm tracking-[0.08em]">
            <a
              href={`tel:${CONTACT.phone}`}
              className="block text-white transition-colors hover:text-[var(--ba-accent)] focus-ring"
            >
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="block text-white transition-colors hover:text-[var(--ba-accent)] focus-ring"
            >
              {CONTACT.email}
            </a>
            <p className="text-white/50">
              {CONTACT.addressLine1}
              <br />
              {CONTACT.addressLine2}
              <br />
              {CONTACT.addressLine3}
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <Field
            label="Όνομα"
            error={errors.name}
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
          />
          <Field
            label="Τηλέφωνο"
            error={errors.phone}
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            type="tel"
            required
          />
          <Field
            label="Email"
            error={errors.email}
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            type="email"
          />
          <Field
            label="Περιοχή"
            value={form.area}
            onChange={(v) => setForm((f) => ({ ...f, area: v }))}
          />

          <fieldset className="mt-6">
            <legend className="eyebrow mb-3 !text-white/45">
              Τι σε ενδιαφέρει
            </legend>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.map((p) => {
                const active = isSelected(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "min-h-11 touch-manipulation border px-3 py-2.5 text-xs tracking-[0.08em] transition-colors focus-ring",
                      active
                        ? "border-[var(--ba-accent)] bg-[var(--ba-accent)] text-white"
                        : "border-white/20 text-white/70 hover:border-white/50",
                    )}
                  >
                    {active ? "✓ " : ""}
                    {p.shortTitle}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-6 block">
            <span className="eyebrow mb-2 block !text-white/45">Μήνυμα</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              className="w-full resize-y border border-white/15 bg-transparent px-3 py-3 text-white outline-none transition-colors focus:border-[var(--ba-accent)]"
            />
          </label>

          <button type="submit" className="ba-button mt-8 w-full sm:w-auto focus-ring">
            Αποστολή αιτήματος
          </button>

          {status === "ready" && (
            <p className="mt-4 text-sm text-[var(--ba-accent)]" role="status">
              Το αίτημα είναι έτοιμο τοπικά. Η online αποστολή θα ενεργοποιηθεί
              όταν συνδεθεί το σύστημα επικοινωνίας. Μπορείς να καλέσεις στο{" "}
              {CONTACT.phoneDisplay}.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-[var(--ba-ember)]" role="alert">
              Έλεγξε τα υποχρεωτικά πεδία.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <label className="mt-5 block first:mt-0" htmlFor={id}>
      <span className="eyebrow mb-2 block !text-white/45">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full border bg-transparent px-3 py-3 text-white outline-none transition-colors focus:border-[var(--ba-accent)]",
          error ? "border-[var(--ba-ember)]" : "border-white/15",
        )}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--ba-ember)]">{error}</span>
      )}
    </label>
  );
}
