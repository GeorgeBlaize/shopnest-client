'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/AuthCard';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ApiClientError } from '@/lib/apiClient';
import { registerSchema, type RegisterInput } from '@/lib/validators';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError('');
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success('Account created! Welcome to ShopNest.');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.';
      setServerError(message);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join ShopNest for faster checkout and order tracking"
      footer={{ text: 'Already have an account?', linkLabel: 'Log in', href: '/login' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField id="name" label="Full name" required error={errors.name?.message}>
          <Input id="name" autoComplete="name" hasError={!!errors.name} {...register('name')} />
        </FormField>

        <FormField id="email" label="Email address" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" hasError={!!errors.email} {...register('email')} />
        </FormField>

        <FormField id="password" label="Password" required error={errors.password?.message} hint="At least 8 characters">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password" required error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
        <span className="h-px flex-1 bg-surface-border" />
        Or continue with
        <span className="h-px flex-1 bg-surface-border" />
      </div>

      <SocialLoginButtons />
    </AuthCard>
  );
}
