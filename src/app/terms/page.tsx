import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: January 1, 2026</p>

      <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By creating an account or placing an order on ShopNest, you agree to these Terms of Service. If you do
            not agree, please do not use the site.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Orders & Payment</h2>
          <p className="mt-2">
            Orders are currently fulfilled on a Cash on Delivery basis. Placing an order is a commitment to pay for
            the goods upon delivery. We reserve the right to cancel orders that appear fraudulent or where the
            requested item is out of stock.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Shipping</h2>
          <p className="mt-2">
            Estimated delivery times are provided in good faith and are not guaranteed. Orders over $75 qualify for
            free standard shipping; all other orders incur a flat shipping fee shown at checkout.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Returns</h2>
          <p className="mt-2">
            Items may be returned within 30 days of delivery in their original condition and packaging for a full
            refund. Contact support to initiate a return.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Account Responsibilities</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account credentials and for all activity
            under your account. Notify us immediately if you suspect unauthorized access.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Product Reviews</h2>
          <p className="mt-2">
            Reviews must reflect a genuine purchase experience. We reserve the right to remove reviews that are
            abusive, spam, or unrelated to the product.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Limitation of Liability</h2>
          <p className="mt-2">
            ShopNest is not liable for indirect or consequential damages arising from the use of this site, to the
            fullest extent permitted by law.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Changes to These Terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of ShopNest after changes are posted
            constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
