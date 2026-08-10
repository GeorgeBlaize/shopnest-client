'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard, ChartEmptyState } from './ChartCard';

interface TopProduct {
  productId: string;
  title: string;
  quantitySold: number;
}

export function TopProductsChart({ data, isLoading }: { data: TopProduct[]; isLoading?: boolean }) {
  const chartData = data.map((d) => ({ ...d, shortTitle: d.title.length > 18 ? `${d.title.slice(0, 18)}…` : d.title }));

  return (
    <ChartCard title="Top Selling Products" subtitle="By units sold across all orders">
      {isLoading ? (
        <div className="h-full w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      ) : chartData.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="shortTitle" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              formatter={(value) => [`${value} sold`, 'Quantity']}
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="quantitySold" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
