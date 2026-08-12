"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductId } from "@/data/products";

interface SelectionContextValue {
  selected: ProductId[];
  toggle: (id: ProductId) => void;
  setSelected: (ids: ProductId[]) => void;
  clear: () => void;
  isSelected: (id: ProductId) => boolean;
  count: number;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ProductId[]>([]);

  const toggle = useCallback((id: ProductId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id: ProductId) => selected.includes(id),
    [selected],
  );

  const value = useMemo(
    () => ({
      selected,
      toggle,
      setSelected,
      clear,
      isSelected,
      count: selected.length,
    }),
    [selected, toggle, clear, isSelected],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within SelectionProvider");
  }
  return ctx;
}
