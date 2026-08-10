'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api, ApiClientError } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { AddressForm } from '@/components/checkout/AddressForm';
import type { Address as AddressType, Order } from '@/types';
import type { AddressInput as AddressInputType } from '@/lib/validators';

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FEE = 5;

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ addresses: AddressType[] }>('/addresses')
      .then((data) => {
        setAddresses(data.addresses);
        const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        if (def) setSelectedId(def.id);
        else setShowForm(true);
      })
      .finally(() => setLoadingAddresses(false));
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && items.length === 0) {
      router.replace('/cart');
    }
  }, [authLoading, user, items.length, router]);

  async function handleAddAddress(values: AddressInputType) {
    setIsSavingAddress(true);
    try {
      const data = await api.post<{ address: AddressType }>('/addresses', values);
      setAddresses((prev) => [data.address, ...prev]);
      setSelectedId(data.address.id);
      setShowForm(false);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not save address');
    } finally {
      setIsSavingAddress(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedId) {
      setError('Select or add a shipping address to continue');
      return;
    }
    setError('');
    setIsPlacingOrder(true);
    try {
      const data = await api.post<{ order: Order }>('/orders', {
        addressId: selectedId,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/checkout/confirmation/${data.order.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Shipping Address</h2>
              {!showForm && (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  <Plus className="size-4" /> Add New
                </Button>
              )}
            </div>

            {loadingAddresses ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : showForm ? (
              <AddressForm
                onSubmit={handleAddAddress}
                isSubmitting={isSavingAddress}
                onCancel={addresses.length > 0 ? () => setShowForm(false) : undefined}
              />
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={cn(
                      'block cursor-pointer rounded-lg border p-4 text-sm transition-colors',
                      selectedId === address.id ? 'border-brand bg-brand/5' : 'border-surface-border'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedId === address.id}
                        onChange={() => setSelectedId(address.id)}
                        className="mt-1 accent-brand"
                      />
                      <div>
                        <p className="font-medium">{address.label}</p>
                        <p className="text-slate-500">
                          {address.line1}, {address.city}, {address.state} {address.postalCode}, {address.country}
                        </p>
                        <p className="text-slate-500">{address.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Payment Method</h2>
            <div className="rounded-lg border border-brand bg-brand/5 p-4 text-sm">
              <p className="font-medium">Cash on Delivery (COD)</p>
              <p className="mt-1 text-slate-500">Pay in cash when your order arrives. No online payment required.</p>
            </div>
          </Card>
        </div>

        <Card className="h-fit space-y-4 p-6">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-2 border-b border-surface-border pb-4 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-2">
                <span className="truncate text-slate-500">
                  {item.title} × {item.quantity}
                </span>
                <span>{formatCurrency(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-surface-border pt-4 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" size="lg" onClick={handlePlaceOrder} isLoading={isPlacingOrder}>
            Place Order (COD)
          </Button>
          <p className="text-center text-xs text-slate-400">
            By placing this order you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
