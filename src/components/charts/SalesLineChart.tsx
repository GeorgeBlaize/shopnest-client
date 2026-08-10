'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartCard, ChartEmptyState } from './ChartCard';
import { formatCurrency } from '@/lib/utils';

interface SalesPoint {
  date: string;
  revenue: number;
}

export function SalesLineChart({ data, isLoading }: { data: SalesPoint[]; isLoading?: boolean }) {
  return (
    <ChartCard title="Revenue (Last 30 Days)" subtitle="Daily revenue from non-cancelled orders">
      {isLoading ? (
        <div className="h-full w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      ) : data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} width={48} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 8, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-brand)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
