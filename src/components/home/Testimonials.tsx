import Image from 'next/image';
import { StarRating } from '@/components/shared/StarRating';
import type { Testimonial } from '@/types';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold">What Our Customers Say</h2>
          <p className="mt-1 text-slate-500">Real feedback from real orders</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.slice(0, 6).map((t) => (
            <div key={t.id} className="rounded-xl border border-surface-border bg-background p-6">
              <StarRating value={t.rating} size={14} />
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">&ldquo;{t.message}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <Image src={t.avatarUrl} alt={t.name} width={36} height={36} className="rounded-full" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
