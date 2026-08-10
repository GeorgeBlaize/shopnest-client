import type { Metadata } from 'next';
import { Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';

export const metadata: Metadata = { title: 'About Us' };

const VALUES = [
  { icon: ShieldCheck, title: 'Trust First', description: 'Every product is vetted, every review is real, and every order is backed by our return policy.' },
  { icon: Truck, title: 'Speed Matters', description: 'We partner with reliable carriers and keep inventory close to customers to ship fast.' },
  { icon: Leaf, title: 'Sustainable Choices', description: "We're steadily expanding our catalog of eco-conscious brands and recyclable packaging." },
  { icon: Heart, title: 'People Over Metrics', description: 'Our support team is measured on whether your problem got solved, not how fast we closed the ticket.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">About ShopNest</h1>
        <p className="mt-4 text-lg text-slate-500">
          We started ShopNest to solve a simple problem: online shopping had gotten bloated, slow, and full of dark
          patterns. We wanted a store that just works.
        </p>
      </div>

      <div className="mt-12 space-y-6 text-slate-600 dark:text-slate-300">
        <p>
          ShopNest launched with a single idea — carry fewer, better products instead of an endless catalog of
          near-duplicates. Every item in our electronics, fashion, home, beauty, sports, books, toys, and grocery
          categories is chosen because it consistently earns strong reviews, not because a supplier paid for
          placement.
        </p>
        <p>
          Today we ship thousands of orders a month from a small, focused team spread across product curation,
          logistics, and customer support. We keep the checkout experience simple — no surprise fees, no forced
          account creation just to browse, and a shipping fee that disappears entirely once your cart crosses $75.
        </p>
        <p>
          We're still a small company, which means when you write in with a problem, a real person reads it and can
          actually do something about it. That's the kind of company we want to stay as we grow.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">What We Stand For</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-xl border border-surface-border p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <value.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold">{value.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
