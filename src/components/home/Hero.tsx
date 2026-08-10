'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    title: 'Everyday Essentials, Delivered Fast',
    subtitle: 'Shop electronics, fashion, home goods, and more — all in one place.',
    cta: { label: 'Shop All Products', href: '/products' },
    image: 'https://picsum.photos/seed/hero-shop-1/1600/900',
  },
  {
    title: 'New Season, New Gear',
    subtitle: 'Refresh your fitness and outdoor essentials with top-rated picks.',
    cta: { label: 'Explore Sports & Outdoors', href: '/products?category=sports-outdoors' },
    image: 'https://picsum.photos/seed/hero-shop-2/1600/900',
  },
  {
    title: 'Upgrade Your Tech',
    subtitle: 'Headphones, monitors, and accessories for work and play.',
    cta: { label: 'Shop Electronics', href: '/products?category=electronics' },
    image: 'https://picsum.photos/seed/hero-shop-3/1600/900',
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative flex h-[65vh] min-h-[420px] max-h-[640px] items-center overflow-hidden">
      {SLIDES.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          className={cn('object-cover transition-opacity duration-700', i === index ? 'opacity-100' : 'opacity-0')}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-white">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{slide.title}</h1>
          <p className="mt-4 text-base text-white/90 sm:text-lg">{slide.subtitle}</p>
          <div className="mt-8 flex gap-3">
            <Link href={slide.cta.href}>
              <Button size="lg">{slide.cta.label}</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50')}
          />
        ))}
      </div>
    </section>
  );
}
