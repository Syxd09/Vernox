import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  id: string; // uuid per line
  productId: string;
  productName: string;
  productSlug: string;
  shapeId: string;
  sizeLabel: string;
  widthMm: number;
  heightMm: number;
  finish: string;
  unitPrice: number;
  quantity: number;
  customDesignThumb?: string; // dataURL preview from customizer
  customDesignRef?: string;   // project id in localStorage
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'vernox-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: CartCtx['add'] = (item) => {
    setItems(prev => [
      ...prev,
      { ...item, id: crypto.randomUUID(), quantity: item.quantity ?? 1 },
    ]);
  };
  const updateQty = (id: string, qty: number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.unitPrice * i.quantity, 0);

  return <Ctx.Provider value={{ items, add, updateQty, remove, clear, count, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used within CartProvider');
  return c;
}
