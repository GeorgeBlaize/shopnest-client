import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'brand' | 'accent' | 'success' | 'neutral' | 'danger';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand/10 text-brand',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  danger: 'bg-red-500/10 text-red-600',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', toneClasses[tone], className)}
      {...props}
    />
  );
}
