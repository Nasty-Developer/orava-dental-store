"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";

export type CartLine = { slug: string; qty: number };

type State = { lines: CartLine[]; ready: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; slug: string; qty: number }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

const STORAGE_KEY = "orava.cart.v1";
const MAX_QTY = 20;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, ready: true };
    case "add": {
      const existing = state.lines.find((l) => l.slug === action.slug);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.slug === action.slug
              ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.qty) }
              : l,
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          { slug: action.slug, qty: Math.min(MAX_QTY, Math.max(1, action.qty)) },
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

export type CartItem = {
  slug: string;
  qty: number;
  product: (typeof products)[number];
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  isOpen: boolean;
  lastAdded: string | null;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const FREE_SHIPPING = 1499;
const FLAT_SHIPPING = 79;

function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(products.map((p) => p.slug));
    return parsed
      .filter(
        (l): l is CartLine =>
          !!l &&
          typeof l.slug === "string" &&
          typeof l.qty === "number" &&
          valid.has(l.slug) &&
          l.qty > 0,
      )
      .map((l) => ({ slug: l.slug, qty: Math.min(MAX_QTY, Math.round(l.qty)) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], ready: false });
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  // hydrate once on mount
  useEffect(() => {
    dispatch({ type: "hydrate", lines: parseStored(localStorage.getItem(STORAGE_KEY)) });
  }, []);

  // persist + sync across tabs
  useEffect(() => {
    if (!state.ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.ready]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: "hydrate", lines: parseStored(e.newValue) });
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
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return null;
        return {
          slug: line.slug,
          qty: line.qty,
          product,
          lineTotal: product.price * line.qty,
        };
      })
      .filter((x): x is CartItem => x !== null);
  }, [state.lines]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const add = useCallback((slug: string, qty = 1) => {
    dispatch({ type: "add", slug, qty });
    setLastAdded(slug);
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
