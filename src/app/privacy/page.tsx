import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: January 1, 2026</p>

      <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-2">
            When you create an account, place an order, or contact support, we collect information such as your
            name, email address, shipping address, and phone number. We do not collect or store payment card
            details, since ShopNest currently operates on a Cash on Delivery basis.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use your information to process orders, provide customer support, send order status updates, and —
            only if you opt in — send marketing emails about new products and promotions. We never sell your
            personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Cookies</h2>
          <p className="mt-2">
            We use a small number of cookies required for the site to function, including an authentication cookie
            that keeps you signed in. We do not use third-party advertising trackers.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Data Sharing</h2>
          <p className="mt-2">
            We share order details with the shipping carrier fulfilling your delivery, and nothing more. Any
            third-party service we use to operate ShopNest is contractually bound to protect your data and use it
            only for the purpose we've engaged them for.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
          <p className="mt-2">
            You can review and update your personal information at any time from your account dashboard. To request
            full deletion of your account and associated data, contact us at support@shopnest.com.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Contact Us</h2>
          <p className="mt-2">
            Questions about this policy can be sent to support@shopnest.com or via our{' '}
            <a href="/contact" className="text-brand hover:underline">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
