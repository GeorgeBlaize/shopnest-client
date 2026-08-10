'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ClipboardList,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Tags,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const USER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const MANAGER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/categories', label: 'Categories', icon: Tags },
  { href: '/dashboard/orders-admin', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/categories', label: 'Categories', icon: Tags },
  { href: '/dashboard/orders-admin', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

function getNavForRole(role: Role): NavItem[] {
  if (role === 'ADMIN') return ADMIN_NAV;
  if (role === 'MANAGER') return MANAGER_NAV;
  return USER_NAV;
}

export function DashboardSidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = getNavForRole(role);

  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="Dashboard">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-brand text-brand-foreground' : 'text-foreground/80 hover:bg-background'
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
