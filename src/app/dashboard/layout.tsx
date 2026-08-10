'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-slate-500">Loading dashboard…</div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-surface lg:block">
        <div className="border-b border-surface-border p-4">
          <Link href="/" className="text-lg font-bold text-brand">
            ShopNest
          </Link>
        </div>
        <DashboardSidebar role={user.role} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-full overflow-y-auto bg-surface">
            <div className="flex items-center justify-between border-b border-surface-border p-4">
              <Link href="/" className="text-lg font-bold text-brand">
                ShopNest
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <DashboardSidebar role={user.role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
