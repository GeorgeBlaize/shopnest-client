'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '@/types';

const STORAGE_KEY = 'shopnest_wishlist';

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  price: string;
  image: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeItem: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt data
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const isWishlisted = useCallback((productId: string) => items.some((i) => i.productId === productId), [items]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product.id)) {
        return prev.filter((i) => i.productId !== product.id);
      }
      return [...prev, { productId: product.id, title: product.title, slug: product.slug, price: product.price, image: product.images[0] }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
