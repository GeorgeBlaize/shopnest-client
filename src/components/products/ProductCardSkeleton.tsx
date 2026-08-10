import { Card } from '@/components/ui/Card';

export function ProductCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="aspect-square w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-auto space-y-3 pt-2">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
