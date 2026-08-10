import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-4 h-64 w-full">{children}</div>
    </Card>
  );
}

export function ChartEmptyState({ message = 'Not enough data yet' }: { message?: string }) {
  return <div className="flex h-full items-center justify-center text-sm text-slate-400">{message}</div>;
}
