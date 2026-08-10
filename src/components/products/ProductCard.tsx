import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full bg-white">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
        />
        {hasDiscount && (
          <Badge tone="accent" className="absolute left-3 top-3">
            Sale
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge tone="neutral" className="w-fit">
          {product.category.name}
        </Badge>
        <Link href={`/products/${product.slug}`} className="line-clamp-2 font-medium leading-snug hover:text-brand">
          {product.title}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{product.shortDesc}</p>
        <div className="mt-auto space-y-3 pt-2">
          <StarRating value={product.avgRating} count={product.reviewCount} size={14} />
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice!)}</span>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="block w-full rounded-lg border border-surface-border py-2 text-center text-sm font-medium transition-colors hover:bg-brand hover:text-brand-foreground hover:border-brand"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
}
