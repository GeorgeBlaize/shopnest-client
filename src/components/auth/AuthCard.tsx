import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: { text: string; linkLabel: string; href: string };
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-brand">
            ShopNest
          </Link>
          <h1 className="mt-4 text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <Card className="p-6 sm:p-8">{children}</Card>
        <p className="mt-6 text-center text-sm text-slate-500">
          {footer.text}{' '}
          <Link href={footer.href} className="font-medium text-brand hover:underline">
            {footer.linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
