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
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'vernox-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      // Sanitize items: strip or compress any oversize base64 data URLs > 15KB
      const sanitized = items.map(item => {
        if (item.customDesignThumb && item.customDesignThumb.length > 15000) {
          return { ...item, customDesignThumb: undefined };
        }
        return item;
      });
      localStorage.setItem(KEY, JSON.stringify(sanitized));
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        console.warn('LocalStorage quota exceeded. Stripping preview thumbnails to preserve cart state.');
        try {
          const stripped = items.map(item => ({ ...item, customDesignThumb: undefined }));
          localStorage.setItem(KEY, JSON.stringify(stripped));
        } catch (innerErr) {
          console.error('Failed to save even stripped cart to localStorage:', innerErr);
        }
      }
    }
  }, [items]);

  const add: CartCtx['add'] = (item) => {
    setItems(prev => [
      ...prev,
      { ...item, id: crypto.randomUUID(), quantity: item.quantity ?? 1 },
    ]);
    setDrawerOpen(true); // Auto open cart drawer when item is added!
  };
  
  const updateQty = (id: string, qty: number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.unitPrice * i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, updateQty, remove, clear, count, subtotal, isDrawerOpen, setDrawerOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used within CartProvider');
  return c;
}
