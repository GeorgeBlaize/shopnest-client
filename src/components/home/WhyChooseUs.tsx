import { Headset, PackageCheck, RotateCcw, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: PackageCheck,
    title: 'Fast, Reliable Shipping',
    description: 'Most orders ship within 24 hours and arrive in 2-5 business days.',
  },
  {
    icon: RotateCcw,
    title: 'Easy 30-Day Returns',
    description: 'Not the right fit? Return it within 30 days for a full refund.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    description: 'Your information is protected with industry-standard security.',
  },
  {
    icon: Headset,
    title: '24/7 Customer Support',
    description: 'Our support team is here to help any time, day or night.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">Why Shop With ShopNest</h2>
        <p className="mt-1 text-slate-500">The essentials, done right</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-surface-border p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <feature.icon className="size-6" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
