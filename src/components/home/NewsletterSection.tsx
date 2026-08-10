'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast.success('You are subscribed! Look out for deals in your inbox.');
    }, 600);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-surface-border bg-surface px-8 py-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Mail className="size-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">Stay in the Loop</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-500">
          Subscribe for exclusive deals, new arrivals, and shopping tips — no spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <Button type="submit" isLoading={isSubmitting}>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
