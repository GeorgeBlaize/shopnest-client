'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({ value, count, size = 16, interactive, onChange, className }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center" role={interactive ? 'radiogroup' : undefined} aria-label="Rating">
        {stars.map((star) => {
          const filled = star <= Math.round(value);
          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={filled}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                onClick={() => onChange?.(star)}
                className="p-0.5"
              >
                <Star
                  width={size}
                  height={size}
                  className={filled ? 'fill-accent text-accent' : 'fill-none text-slate-300'}
                />
              </button>
            );
          }
          return (
            <Star
              key={star}
              width={size}
              height={size}
              className={filled ? 'fill-accent text-accent' : 'fill-none text-slate-300'}
              aria-hidden
            />
          );
        })}
      </div>
      {typeof count === 'number' && <span className="text-xs text-slate-500">({count})</span>}
    </div>
  );
}
