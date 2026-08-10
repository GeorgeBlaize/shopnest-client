'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Package, ShoppingBag, Star, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/apiClient';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesLineChart } from '@/components/charts/SalesLineChart';
import { OrdersStatusChart } from '@/components/charts/OrdersStatusChart';
import { TopProductsChart } from '@/components/charts/TopProductsChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

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

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [overview, setOverview] = useState<Overview | null>(null);
  const [myStats, setMyStats] = useState<MyStats | null>(null);
  const [sales, setSales] = useState<{ date: string; revenue: number }[]>([]);
  const [statusData, setStatusData] = useState<{ status: string; count: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ productId: string; title: string; quantitySold: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (isStaff) {
      Promise.all([
        api.get<Overview>('/dashboard/overview'),
        api.get<{ series: { date: string; revenue: number }[] }>('/dashboard/sales-over-time'),
        api.get<{ items: { status: string; count: number }[] }>('/dashboard/orders-by-status'),
        api.get<{ items: { productId: string; title: string; quantitySold: number }[] }>('/dashboard/top-products'),
      ])
        .then(([ov, salesRes, statusRes, topRes]) => {
          setOverview(ov);
          setSales(salesRes.series);
          setStatusData(statusRes.items);
          setTopProducts(topRes.items);
        })
        .finally(() => setIsLoading(false));
    } else {
      Promise.all([
        api.get<MyStats>('/dashboard/my-stats'),
        api.get<{ items: Order[] }>('/orders/mine', { limit: 5 }),
      ])
        .then(([stats, orders]) => {
          setMyStats(stats);
          setRecentOrders(orders.items);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, isStaff]);

  if (!user) return null;

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-slate-500">Store performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={formatCurrency(overview?.totalRevenue || 0)} icon={DollarSign} isLoading={isLoading} />
          <StatCard label="Total Orders" value={String(overview?.totalOrders ?? 0)} icon={ShoppingBag} isLoading={isLoading} />
          <StatCard label="Total Users" value={String(overview?.totalUsers ?? 0)} icon={Users} isLoading={isLoading} />
          <StatCard label="Total Products" value={String(overview?.totalProducts ?? 0)} icon={Package} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SalesLineChart data={sales} isLoading={isLoading} />
          <OrdersStatusChart data={statusData} isLoading={isLoading} />
        </div>
        <TopProductsChart data={topProducts} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500">Here's a quick look at your account</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Orders Placed" value={String(myStats?.orderCount ?? 0)} icon={ShoppingBag} isLoading={isLoading} />
        <StatCard label="Total Spent" value={formatCurrency(myStats?.totalSpent || 0)} icon={DollarSign} isLoading={isLoading} />
        <StatCard label="Reviews Written" value={String(myStats?.reviewCount ?? 0)} icon={Star} isLoading={isLoading} />
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-surface-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                  <Badge tone="brand">{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
