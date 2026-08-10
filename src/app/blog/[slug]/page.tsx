import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { publicApiGet } from '@/lib/publicApi';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await publicApiGet<{ post: BlogPost }>(`/blog/${slug}`);
  return { title: data?.post.title || 'Blog post' };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await publicApiGet<{ post: BlogPost }>(`/blog/${slug}`);

  if (!data) notFound();
  const { post } = data;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="text-sm text-brand hover:underline">
        ← Back to Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {formatDate(post.createdAt)} · By {post.authorName}
      </p>
      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl">
        <Image src={post.coverImage} alt={post.title} fill sizes="768px" className="object-cover" priority />
      </div>
      <div className="mt-8">
        {post.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
