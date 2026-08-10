import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export function LatestBlogPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">From the Blog</h2>
          <p className="mt-1 text-slate-500">Tips, guides, and product picks</p>
        </div>
        <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
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
              <p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p>
              <h3 className="mt-1 line-clamp-2 font-semibold group-hover:text-brand">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
