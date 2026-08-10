import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { StatsHighlights } from '@/components/home/StatsHighlights';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Testimonials } from '@/components/home/Testimonials';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { FAQAccordion } from '@/components/home/FAQAccordion';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { publicApiGet } from '@/lib/publicApi';
import type { BlogPost, Category, PaginatedResponse, Product, Testimonial } from '@/types';

export default async function HomePage() {
  const [categoriesData, featuredData, testimonialsData, blogData] = await Promise.all([
    publicApiGet<{ categories: Category[] }>('/categories'),
    publicApiGet<PaginatedResponse<Product>>('/products?featured=true&limit=8'),
    publicApiGet<{ testimonials: Testimonial[] }>('/testimonials'),
    publicApiGet<PaginatedResponse<BlogPost>>('/blog?limit=3'),
  ]);

  return (
    <div>
      <Hero />
      <FeaturedCategories categories={categoriesData?.categories || []} />
      <FeaturedProducts products={featuredData?.items || []} />
      <WhyChooseUs />
      <StatsHighlights />
      <PromoBanner />
      <Testimonials testimonials={testimonialsData?.testimonials || []} />
      <LatestBlogPosts posts={blogData?.items || []} />
      <FAQAccordion />
      <NewsletterSection />
    </div>
  );
}
