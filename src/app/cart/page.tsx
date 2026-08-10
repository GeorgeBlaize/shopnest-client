'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FEE = 5;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  function handleCheckout() {
    router.push(user ? '/checkout' : '/login?redirect=/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto size-12 text-slate-300" />
        <h1 className="mt-4 text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Browse our catalog and add something you love.</p>
        <Link href="/products">
          <Button className="mt-6">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4 p-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>
              </div>
              <div className="flex items-center rounded-lg border border-surface-border">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="flex size-9 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="flex size-9 items-center justify-center"
                  aria-label="Increase quantity"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <p className="w-20 shrink-0 text-right font-medium">
                {formatCurrency(parseFloat(item.price) * item.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.title}`}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </Card>
          ))}
        </div>

        <Card className="h-fit space-y-4 p-6">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-slate-400">
                Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </div>
          <div className="flex justify-between border-t border-surface-border pt-4 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
}
