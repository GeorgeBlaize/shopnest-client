import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  isLoading?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon className="size-4" />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-3 h-7 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      ) : (
        <p className="mt-3 text-2xl font-bold">{value}</p>
      )}
    </Card>
  );
}
