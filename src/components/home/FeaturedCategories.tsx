import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <p className="mt-1 text-slate-500">Find exactly what you&apos;re looking for</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={cat.imageUrl}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
            <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
