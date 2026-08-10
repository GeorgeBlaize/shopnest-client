'use client';

import { Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export interface ProductFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
}

interface FiltersProps {
  categories: Category[];
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onClear: () => void;
}

export function Filters({ categories, filters, onChange, onClear }: FiltersProps) {
  const hasActiveFilters = Boolean(filters.category || filters.minPrice || filters.maxPrice || filters.rating);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="text-xs font-medium text-brand hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Category</h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={filters.category === ''}
              onChange={() => onChange({ category: '' })}
              className="accent-brand"
            />
            All categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => onChange({ category: cat.slug })}
                className="accent-brand"
              />
              {cat.name}
              {cat._count && <span className="text-xs text-slate-400">({cat._count.products})</span>}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Price range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
          />
          <span className="text-slate-400">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Minimum rating</h3>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ rating: filters.rating === String(rating) ? '' : String(rating) })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors',
                filters.rating === String(rating)
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-transparent hover:bg-surface'
              )}
            >
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('size-3.5', i < rating ? 'fill-accent text-accent' : 'fill-none text-slate-300')} />
                ))}
              </span>
              & up
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full lg:hidden" onClick={onClear}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}
