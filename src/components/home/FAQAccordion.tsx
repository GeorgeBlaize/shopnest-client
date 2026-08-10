'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'How long does shipping take?',
    answer: 'Most orders ship within 24 hours and arrive within 2-5 business days depending on your location. You can track your order from your dashboard once it ships.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of delivery for a full refund, as long as the item is unused and in its original packaging.',
  },
  {
    question: 'Do you offer free shipping?',
    answer: 'Yes — orders over $75 qualify for free standard shipping automatically at checkout, no code required.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Log in and visit "My Orders" in your dashboard to see real-time status updates for every order you have placed.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Orders are currently placed with Cash on Delivery (COD). More payment options are coming soon.',
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-1 text-slate-500">Everything you need to know before you order</p>
      </div>
      <div className="divide-y divide-surface-border rounded-xl border border-surface-border">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
              >
                {faq.question}
                <ChevronDown className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
              </button>
              <div className={cn('overflow-hidden px-5 text-sm text-slate-500 transition-all', isOpen ? 'max-h-40 pb-4' : 'max-h-0')}>
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
