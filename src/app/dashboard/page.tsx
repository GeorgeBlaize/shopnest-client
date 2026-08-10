'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Package, ShoppingBag, Star, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/apiClient';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

interface Overview {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}
interface MyStats {
  orderCount: number;
  totalSpent: number;
  reviewCount: number;
}

const STATUS_TONES: Record<OrderStatus, 'neutral' | 'brand' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'neutral',
  PROCESSING: 'brand',
  SHIPPED: 'accent',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [overview, setOverview] = useState<Overview | null>(null);
  const [myStats, setMyStats] = useState<MyStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (isStaff) {
      Promise.all([
        api.get<Overview>('/dashboard/overview'),
        api.get<{ items: Order[] }>('/orders', { limit: 5 }),
      ])
        .then(([ov, orders]) => {
          setOverview(ov);
          setRecentOrders(orders.items);
        })
        .finally(() => setIsLoading(false));
    } else {
      Promise.all([api.get<MyStats>('/dashboard/my-stats'), api.get<{ items: Order[] }>('/orders/mine', { limit: 5 })])
        .then(([stats, orders]) => {
          setMyStats(stats);
          setRecentOrders(orders.items);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, isStaff]);

  if (!user) return null;

  const ordersHref = isStaff ? '/dashboard/orders-admin' : '/dashboard/orders';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isStaff ? 'Overview' : `Welcome back, ${user.name.split(' ')[0]}`}</h1>
        <p className="text-sm text-slate-500">
          {isStaff ? 'Store performance at a glance' : "Here's a quick look at your account"}
        </p>
      </div>

      {isStaff ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={formatCurrency(overview?.totalRevenue || 0)} icon={DollarSign} isLoading={isLoading} />
          <StatCard label="Total Orders" value={String(overview?.totalOrders ?? 0)} icon={ShoppingBag} isLoading={isLoading} />
          <StatCard label="Total Users" value={String(overview?.totalUsers ?? 0)} icon={Users} isLoading={isLoading} />
          <StatCard label="Total Products" value={String(overview?.totalProducts ?? 0)} icon={Package} isLoading={isLoading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Orders Placed" value={String(myStats?.orderCount ?? 0)} icon={ShoppingBag} isLoading={isLoading} />
          <StatCard label="Total Spent" value={formatCurrency(myStats?.totalSpent || 0)} icon={DollarSign} isLoading={isLoading} />
          <StatCard label="Reviews Written" value={String(myStats?.reviewCount ?? 0)} icon={Star} isLoading={isLoading} />
        </div>
      )}

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href={ordersHref} className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-surface-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(order.createdAt)}
                    {isStaff && order.user ? ` · ${order.user.name}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                  <Badge tone={STATUS_TONES[order.status]}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
