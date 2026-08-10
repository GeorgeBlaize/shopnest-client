import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Package, RotateCcw, UserCog } from 'lucide-react';
import { FAQAccordion } from '@/components/home/FAQAccordion';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Help & Support' };

const TOPICS = [
  { icon: Package, title: 'Orders & Shipping', description: 'Track a package, change a shipping address, or check delivery estimates.' },
  { icon: RotateCcw, title: 'Returns & Refunds', description: 'Start a return, check refund status, or read our 30-day return policy.' },
  { icon: CreditCard, title: 'Payments', description: 'Questions about Cash on Delivery or a charge on your order.' },
  { icon: UserCog, title: 'Account & Profile', description: 'Update your profile, change your password, or manage your addresses.' },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="mt-2 text-slate-500">Find answers below, or reach out and a real person will help.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="rounded-xl border border-surface-border p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <topic.icon className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold">{topic.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{topic.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <FAQAccordion />
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface p-8 text-center">
        <h2 className="text-xl font-bold">Still need help?</h2>
        <p className="mt-2 text-slate-500">Our support team responds within one business day.</p>
        <Link href="/contact">
          <Button className="mt-4">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
