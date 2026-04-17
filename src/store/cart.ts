import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  colorName: string;
  size: string;
  qty: number;
  image: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  count: () => number;
};

const STORAGE_KEY = "audrey-cart-v1";

const load = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

export const useCart = create<CartStore>((set, get) => ({
  items: load(),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  add: (item, qty = 1) =>
    set((s) => {
      const idx = s.items.findIndex((i) => i.productId === item.productId && i.size === item.size);
      let next: CartItem[];
      if (idx >= 0) {
        next = [...s.items];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      } else {
        next = [...s.items, { ...item, qty }];
      }
      save(next);
      return { items: next, isOpen: true };
    }),
  remove: (productId, size) =>
    set((s) => {
      const next = s.items.filter((i) => !(i.productId === productId && i.size === size));
      save(next);
      return { items: next };
    }),
  updateQty: (productId, size, qty) =>
    set((s) => {
      if (qty <= 0) {
        const next = s.items.filter((i) => !(i.productId === productId && i.size === size));
        save(next);
        return { items: next };
      }
      const next = s.items.map((i) =>
        i.productId === productId && i.size === size ? { ...i, qty } : i
      );
      save(next);
      return { items: next };
    }),
  clear: () => {
    save([]);
    set({ items: [] });
  },
  count: () => get().items.reduce((n, i) => n + i.qty, 0),
}));
