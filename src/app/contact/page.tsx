import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Get in Touch</h1>
        <p className="mt-2 text-slate-500">Questions about an order, a product, or a partnership? We&apos;d love to hear from you.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>

        <div className="space-y-4">
          <Card className="flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-slate-500">500 Market Street, Austin, TX 78701</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Phone className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-slate-500">+1 (512) 555-0148</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Mail className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-slate-500">support@shopnest.com</p>
            </div>
          </Card>
          <Card className="p-5">
            <p className="font-medium">Support Hours</p>
            <p className="mt-1 text-sm text-slate-500">Monday – Friday, 9am – 6pm CT</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
