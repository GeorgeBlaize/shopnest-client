'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Menu, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';

export function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-9 items-center justify-center rounded-lg border border-surface-border lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4" />
        </button>
        <span className="text-sm text-slate-500">
          Signed in as <span className="font-medium text-foreground">{user.role}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu
          trigger={
            <span className="flex items-center gap-2 rounded-lg border border-surface-border px-2 py-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                <UserIcon className="size-3.5" />
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </span>
          }
        >
          <div className="border-b border-surface-border px-4 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <DropdownItem href="/dashboard/profile">
            <UserIcon className="size-4" /> Profile
          </DropdownItem>
          <DropdownItem href="/dashboard/settings">
            <Settings className="size-4" /> Settings
          </DropdownItem>
          <DropdownItem onClick={handleLogout} className="text-red-600">
            <LogOut className="size-4" /> Logout
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
