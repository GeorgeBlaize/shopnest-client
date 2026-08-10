'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-sm text-slate-500">Products you've saved for later</p>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="mx-auto size-10 text-slate-300" />
          <p className="mt-4 font-medium">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-slate-500">Tap the heart icon on any product to save it here.</p>
          <Link href="/products">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4 p-4">
              <Link href={`/products/${item.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.slug}`} className="line-clamp-1 text-sm font-medium hover:text-brand">
                  {item.title}
                </Link>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.title} from wishlist`}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
