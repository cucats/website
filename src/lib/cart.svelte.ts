import { browser } from "$app/environment";

const KEY = "cucats-cart";

export type CartItem = { variantId: number; qty: number };

function load(): CartItem[] {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        i && typeof i.variantId === "number" && typeof i.qty === "number",
    );
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (!browser) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

class Cart {
  items = $state<CartItem[]>([]);

  constructor() {
    if (browser) this.items = load();
  }

  add(variantId: number, qty = 1) {
    const existing = this.items.find((i) => i.variantId === variantId);
    if (existing) existing.qty += qty;
    else this.items.push({ variantId, qty });
    persist(this.items);
  }

  setQty(variantId: number, qty: number) {
    const idx = this.items.findIndex((i) => i.variantId === variantId);
    if (idx === -1) return;
    if (qty <= 0) this.items.splice(idx, 1);
    else this.items[idx].qty = qty;
    persist(this.items);
  }

  remove(variantId: number) {
    const idx = this.items.findIndex((i) => i.variantId === variantId);
    if (idx >= 0) this.items.splice(idx, 1);
    persist(this.items);
  }

  clear() {
    this.items.length = 0;
    persist(this.items);
  }

  get count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  }
}

export const cart = new Cart();
