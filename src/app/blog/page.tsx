import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { publicApiGet } from '@/lib/publicApi';
import { formatDate } from '@/lib/utils';
import type { BlogPost, PaginatedResponse } from '@/types';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const data = await publicApiGet<PaginatedResponse<BlogPost>>(`/blog?page=${page}&limit=6`);
  const posts = data?.items || [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">The ShopNest Blog</h1>
        <p className="mt-2 text-slate-500">Guides, tips, and product picks from our team</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-slate-500">No blog posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-surface-border">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-500">
                  {formatDate(post.createdAt)} · {post.authorName}
                </p>
                <h2 className="mt-1 line-clamp-2 font-semibold group-hover:text-brand">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/blog?page=${i + 1}`}
              className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium ${
                page === i + 1 ? 'border-brand bg-brand text-brand-foreground' : 'border-surface-border hover:bg-surface'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
