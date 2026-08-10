'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard, ChartEmptyState } from './ChartCard';

interface StatusPoint {
  status: string;
  count: number;
}

const COLORS: Record<string, string> = {
  PENDING: '#94a3b8',
  PROCESSING: 'var(--color-brand)',
  SHIPPED: 'var(--color-accent)',
  DELIVERED: 'var(--color-success)',
  CANCELLED: '#ef4444',
};

export function OrdersStatusChart({ data, isLoading }: { data: StatusPoint[]; isLoading?: boolean }) {
  return (
    <ChartCard title="Orders by Status" subtitle="Distribution across all orders">
      {isLoading ? (
        <div className="h-full w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      ) : data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={COLORS[entry.status] || '#94a3b8'} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
