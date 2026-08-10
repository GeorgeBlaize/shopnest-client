'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export function AddToCartBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, quantity);
    toast.success(`Added ${quantity} × ${product.title} to cart`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-surface-border">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-11 items-center justify-center disabled:opacity-40"
          aria-label="Decrease quantity"
          disabled={outOfStock}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center text-sm font-medium" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="flex size-11 items-center justify-center disabled:opacity-40"
          aria-label="Increase quantity"
          disabled={outOfStock}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button onClick={handleAdd} disabled={outOfStock} size="lg" className="flex-1 sm:flex-none">
        <ShoppingCart className="size-4" />
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
