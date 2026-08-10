'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { SalesLineChart } from '@/components/charts/SalesLineChart';
import { OrdersStatusChart } from '@/components/charts/OrdersStatusChart';
import { TopProductsChart } from '@/components/charts/TopProductsChart';
import { RequireRole } from '@/components/dashboard/RequireRole';

export default function AnalyticsPage() {
  const [sales, setSales] = useState<{ date: string; revenue: number }[]>([]);
  const [statusData, setStatusData] = useState<{ status: string; count: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ productId: string; title: string; quantitySold: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ series: { date: string; revenue: number }[] }>('/dashboard/sales-over-time'),
      api.get<{ items: { status: string; count: number }[] }>('/dashboard/orders-by-status'),
      api.get<{ items: { productId: string; title: string; quantitySold: number }[] }>('/dashboard/top-products'),
    ])
      .then(([salesRes, statusRes, topRes]) => {
        setSales(salesRes.series);
        setStatusData(statusRes.items);
        setTopProducts(topRes.items);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-slate-500">Deeper insight into sales and product performance</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SalesLineChart data={sales} isLoading={isLoading} />
          <OrdersStatusChart data={statusData} isLoading={isLoading} />
        </div>
        <TopProductsChart data={topProducts} isLoading={isLoading} />
      </div>
    </RequireRole>
  );
}
