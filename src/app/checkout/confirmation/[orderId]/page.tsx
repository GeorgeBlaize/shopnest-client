'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/apiClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<{ order: Order }>(`/orders/${params.orderId}`)
      .then((data) => setOrder(data.order))
      .catch(() => setError(true));
  }, [params.orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p>We couldn&apos;t find that order.</p>
        <Link href="/dashboard/orders" className="mt-4 inline-block text-brand hover:underline">
          View my orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center text-slate-500">Loading order…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-slate-500">
          Thank you — your order <span className="font-medium text-foreground">{order.orderNumber}</span> has been
          placed and will be paid via Cash on Delivery.
        </p>
      </div>

      <Card className="mt-8 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Order Details</h2>
          <Badge tone="brand">{order.status}</Badge>
        </div>
        <div className="space-y-2 border-b border-surface-border pb-4 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-slate-500">
                {item.titleSnapshot} × {item.quantity}
              </span>
              <span>{formatCurrency(parseFloat(item.priceSnapshot) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Shipping</span>
            <span>{Number(order.shippingFee) === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">Placed on {formatDate(order.createdAt)}</p>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            View My Orders
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
