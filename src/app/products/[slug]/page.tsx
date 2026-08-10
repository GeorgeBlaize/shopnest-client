'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ImageGallery } from '@/components/products/ImageGallery';
import { AddToCartBox } from '@/components/products/AddToCartBox';
import { ReviewsSection } from '@/components/products/ReviewsSection';
import { ProductCard } from '@/components/products/ProductCard';
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';
import type { Product, Review } from '@/types';

interface ProductDetailResponse {
  product: Product & { reviews: Review[] };
  related: Product[];
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<ProductDetailResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get<ProductDetailResponse>(`/products/${params.slug}`)
      .then((res) => {
        setData(res);
        setReviews(res.product.reviews);
      })
      .catch(() => setNotFound(true));
  }, [params.slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-slate-500">This product may have been removed.</p>
        <Link href="/products" className="mt-4 inline-block text-brand hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-24 w-full rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  const { product, related } = data;
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>{' '}
        / <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div>
          <Badge tone="neutral">{product.category.name}</Badge>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{product.title}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.avgRating} count={product.reviewCount} />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through">{formatCurrency(product.compareAtPrice!)}</span>
            )}
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{product.shortDesc}</p>
          <p className="mt-2 text-sm text-slate-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Currently out of stock'}
          </p>
          <div className="mt-6">
            <AddToCartBox product={product} />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Specifications</h2>
          <dl className="mt-3 divide-y divide-surface-border rounded-xl border border-surface-border">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-slate-500">{key}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold">Reviews & Ratings</h2>
        <ReviewsSection productId={product.id} reviews={reviews} onReviewAdded={(r) => setReviews((prev) => [r, ...prev])} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-lg font-semibold">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
