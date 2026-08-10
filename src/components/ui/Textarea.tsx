import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, hasError, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20',
        hasError ? 'border-red-500' : 'border-surface-border',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
