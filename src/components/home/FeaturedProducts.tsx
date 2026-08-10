import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="mt-1 text-slate-500">Hand-picked favorites our customers love</p>
          </div>
          <Link href="/products?featured=true" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
