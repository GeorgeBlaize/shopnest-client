'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Menu, Settings, ShoppingCart, User as UserIcon, X, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from './ThemeToggle';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const baseLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? [...baseLinks, { href: '/dashboard', label: 'Dashboard' }] : [...baseLinks, { href: '/contact', label: 'Contact' }];

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-brand">
          ShopNest
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cart"
            aria-label={`Cart with ${itemCount} items`}
            className="relative flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-surface"
          >
            <ShoppingCart className="size-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu
              trigger={
                <span className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <UserIcon className="size-4" />
                </span>
              }
            >
              <div className="border-b border-surface-border px-4 py-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <DropdownItem href="/dashboard">
                <LayoutDashboard className="size-4" /> Dashboard
              </DropdownItem>
              <DropdownItem href="/dashboard/profile">
                <UserIcon className="size-4" /> Profile
              </DropdownItem>
              <DropdownItem href="/dashboard/orders">
                <Package className="size-4" /> My Orders
              </DropdownItem>
              <DropdownItem href="/dashboard/settings">
                <Settings className="size-4" /> Settings
              </DropdownItem>
              <DropdownItem onClick={handleLogout} className="text-red-600">
                <LogOut className="size-4" /> Logout
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg border border-surface-border md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div className={cn('overflow-hidden border-t border-surface-border md:hidden', mobileOpen ? 'max-h-96' : 'max-h-0 border-t-0')}>
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
