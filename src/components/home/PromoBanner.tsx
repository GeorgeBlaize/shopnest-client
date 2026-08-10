import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-accent px-8 py-12 text-center text-accent-foreground sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-bold">Free Shipping on Orders Over $75</h2>
          <p className="mt-2 opacity-80">No code needed — discount applies automatically at checkout.</p>
        </div>
        <Link href="/products">
          <Button size="lg" variant="primary">
            Start Shopping
          </Button>
        </Link>
      </div>
    </section>
  );
}
