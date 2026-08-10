'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { api, ApiClientError } from '@/lib/apiClient';
import { contactSchema, type ContactInput } from '@/lib/validators';

export function ContactForm() {
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    setServerError('');
    try {
      await api.post('/contact', values);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Could not send your message. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border p-10 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <p className="mt-3 font-semibold">Message sent!</p>
        <p className="mt-1 text-sm text-slate-500">We typically respond within one business day.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="name" label="Full name" required error={errors.name?.message}>
          <Input id="name" hasError={!!errors.name} {...register('name')} />
        </FormField>
        <FormField id="email" label="Email address" required error={errors.email?.message}>
          <Input id="email" type="email" hasError={!!errors.email} {...register('email')} />
        </FormField>
      </div>
      <FormField id="subject" label="Subject" required error={errors.subject?.message}>
        <Input id="subject" hasError={!!errors.subject} {...register('subject')} />
      </FormField>
      <FormField id="message" label="Message" required error={errors.message?.message}>
        <Textarea id="message" rows={5} hasError={!!errors.message} {...register('message')} />
      </FormField>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
}
