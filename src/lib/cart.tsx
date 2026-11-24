"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  CategorySlug,
  ProductImage,
  ProductSummary,
  ProductVisual,
} from "@/data/types";
import { loadSearchIndex } from "./search-index-client";

/**
 * A cart line carries everything needed to render and total itself: name,
 * brand, price, artwork. That is deliberate — it means the cart never imports
 * the catalogue, so a 3,000-product catalogue costs the cart nothing.
 */
export type CartLine = {
  slug: string;
  qty: number;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  packaging: string | null;
  price: number;
  visual: ProductVisual;
  image: ProductImage | null;
};

/** The product half of a line: what a component must hand to `add()`. */
export type CartProductInput = Omit<CartLine, "qty" | "price"> & { price: number | null };

export type CartProduct = Omit<CartLine, "qty">;

export type CartItem = {
  slug: string;
  qty: number;
  /** Only priced products can be added to a cart, so price is always known here. */
  product: CartProduct & { price: number };
  lineTotal: number;
};

/** A line restored from storage may predate this shape and hold only a slug. */
type StoredLine = { slug: string; qty: number } & Partial<Omit<CartLine, "slug" | "qty">>;

type State = { lines: StoredLine[]; ready: boolean };

type Action =
  | { type: "hydrate"; lines: StoredLine[] }
  | { type: "add"; line: CartLine }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

const STORAGE_KEY = "somil.cart.v1";
/** Carts saved before the SOMIL rebrand are carried over once. */
const LEGACY_KEY = "orava.cart.v1";
const MAX_QTY = 20;

const isComplete = (line: StoredLine): line is CartLine =>
  typeof line.price === "number" &&
  typeof line.name === "string" &&
  typeof line.brand === "string" &&
  typeof line.category === "string" &&
  typeof line.visual === "string";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, ready: true };
    case "add": {
      const existing = state.lines.find((l) => l.slug === action.line.slug);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.slug === action.line.slug
              ? { ...action.line, qty: Math.min(MAX_QTY, l.qty + action.line.qty) }
              : l,
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          { ...action.line, qty: Math.min(MAX_QTY, Math.max(1, action.line.qty)) },
        ],
      };
    }
    case "setQty":
      return {
        ...state,
        lines:
          action.qty <= 0
            ? state.lines.filter((l) => l.slug !== action.slug)
            : state.lines.map((l) =>
                l.slug === action.slug
                  ? { ...l, qty: Math.min(MAX_QTY, action.qty) }
                  : l,
              ),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "clear":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  isOpen: boolean;
  lastAdded: string | null;
  add: (product: CartProductInput, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const FREE_SHIPPING = 1499;
const FLAT_SHIPPING = 79;

/** Split stored JSON into usable lines and lines that still need a lookup. */
function readStored(raw: string | null): { lines: CartLine[]; unresolved: { slug: string; qty: number }[] } {
  const empty = { lines: [], unresolved: [] };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return empty;

    const lines: CartLine[] = [];
    const unresolved: { slug: string; qty: number }[] = [];

    for (const l of parsed) {
      if (!l || typeof l.slug !== "string" || typeof l.qty !== "number" || l.qty <= 0) continue;
      const qty = Math.min(MAX_QTY, Math.round(l.qty));
      const line: StoredLine = { ...l, slug: l.slug, qty };
      if (isComplete(line)) lines.push({ ...line, qty });
      else unresolved.push({ slug: l.slug, qty });
    }
    return { lines, unresolved };
  } catch {
    return empty;
  }
}

const lineFrom = (item: ProductSummary | CartProductInput, qty: number): CartLine => ({
  slug: item.slug,
  qty: Math.min(MAX_QTY, Math.max(1, qty)),
  name: item.name,
  brand: item.brand,
  category: item.category,
  subcategory: item.subcategory,
  packaging: item.packaging,
  price: item.price as number,
  visual: item.visual,
  image: item.image,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], ready: false });
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const hydrated = useRef(false);

  // hydrate once on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const current = localStorage.getItem(STORAGE_KEY);
    const legacy = current ? null : localStorage.getItem(LEGACY_KEY);
    const raw = current ?? legacy;
    const { lines, unresolved } = readStored(raw);

    if (!current && legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_KEY);
    }

    if (!unresolved.length) {
      dispatch({ type: "hydrate", lines });
      return;
    }

    // A cart saved before lines carried their own product data holds slugs only.
    // Resolve it from the static index. If the index is unavailable the lines
    // are kept exactly as they are, so nothing is lost and the next visit retries.
    let cancelled = false;
    loadSearchIndex().then((index) => {
      if (cancelled) return;
      if (!index.length) {
        dispatch({ type: "hydrate", lines: [...lines, ...unresolved] });
        return;
      }
      const bySlug = new Map(index.map((p) => [p.slug, p]));
      const resolved = unresolved
        .map((l) => {
          const hit = bySlug.get(l.slug);
          return hit && hit.price !== null ? lineFrom(hit, l.qty) : null;
        })
        .filter((l): l is CartLine => l !== null);
      dispatch({ type: "hydrate", lines: [...lines, ...resolved] });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // persist + sync across tabs
  useEffect(() => {
    if (!state.ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.ready]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: "hydrate", lines: readStored(e.newValue).lines });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const items = useMemo<CartItem[]>(() => {
    return state.lines
      .filter(isComplete)
      .map((line) => {
        const product = {
          slug: line.slug,
          name: line.name,
          brand: line.brand,
          category: line.category,
          subcategory: line.subcategory,
          packaging: line.packaging,
          price: line.price,
          visual: line.visual,
          image: line.image,
        };
        return {
          slug: line.slug,
          qty: line.qty,
          product,
          lineTotal: product.price * line.qty,
        };
      });
  }, [state.lines]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const add = useCallback((product: CartProductInput, qty = 1) => {
    // products without a confirmed price are handled by enquiry, not the cart
    if (product.price === null) return;
    dispatch({ type: "add", line: lineFrom(product, qty) });
    setLastAdded(product.slug);
    setIsOpen(true);
  }, []);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    shipping,
    total,
    ready: state.ready,
    isOpen,
    lastAdded,
    add,
    setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
    remove: (slug) => dispatch({ type: "remove", slug }),
    clear: () => dispatch({ type: "clear" }),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const cartConfig = { freeShipping: FREE_SHIPPING, flatShipping: FLAT_SHIPPING };
