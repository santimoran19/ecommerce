import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { id: string; name: string; price: number; image: string; quantity: number };

type State = {
  items: CartItem[];
  add: (i: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  setQty: (id: string, q: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<State>()(persist((set, get) => ({
  items: [],
  add: (item) => set((s) => {
    const ex = s.items.find((x) => x.id === item.id);
    return { items: ex ? s.items.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x) : [...s.items, { ...item, quantity: 1 }] };
  }),
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
  setQty: (id, q) => set((s) => ({ items: s.items.map((x) => x.id === id ? { ...x, quantity: Math.max(1, q) } : x) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((a, x) => a + x.price * x.quantity, 0),
}), { name: "cart" }));
