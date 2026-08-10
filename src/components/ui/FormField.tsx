import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ id, label, error, success, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && !success && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="flex items-center gap-1 text-xs text-success">
          <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
          {success}
        </p>
      )}
    </div>
  );
}
