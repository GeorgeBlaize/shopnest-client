'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/ui/SocialIcons';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/products?featured=true', label: 'Featured' },
      { href: '/cart', label: 'Cart' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help', label: 'Help & Support' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/dashboard/orders', label: 'Track Order' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast.success('Subscribed! Watch your inbox for deals.');
    }, 600);
  }

  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold text-brand">
              ShopNest
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Everyday essentials and gear you can trust, delivered quickly with hassle-free returns.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" /> 500 Market Street, Austin, TX 78701
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" /> +1 (512) 555-0148
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" /> support@shopnest.com
              </p>
            </div>
            <div className="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-background">
                <FacebookIcon className="size-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-background">
                <TwitterIcon className="size-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-background">
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold">Newsletter</h3>
            <p className="mt-3 text-sm text-slate-500">Get 10% off your first order and weekly deals.</p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <Button type="submit" size="sm" isLoading={isSubmitting}>
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
