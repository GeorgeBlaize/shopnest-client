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
import { loginSchema, type LoginInput } from '@/lib/validators';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@shopnest.com', password: 'Admin@123' },
  { role: 'Manager', email: 'manager@shopnest.com', password: 'Manager@123' },
  { role: 'User', email: 'user@shopnest.com', password: 'User@123' },
] as const;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function performLogin(values: LoginInput) {
    setServerError('');
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Login failed. Please try again.';
      setServerError(message);
    }
  }

  async function handleDemoLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    setValue('email', account.email);
    setValue('password', account.password);
    setDemoLoadingRole(account.role);
    await performLogin({ email: account.email, password: account.password });
    setDemoLoadingRole(null);
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to manage your orders and account"
      footer={{ text: "Don't have an account?", linkLabel: 'Create one', href: '/register' }}
    >
      <form onSubmit={handleSubmit(performLogin)} noValidate className="space-y-4">
        <FormField id="email" label="Email address" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" hasError={!!errors.email} {...register('email')} />
        </FormField>

        <FormField id="password" label="Password" required error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            hasError={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting && !demoLoadingRole}>
          Log in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
        <span className="h-px flex-1 bg-surface-border" />
        Or continue with
        <span className="h-px flex-1 bg-surface-border" />
      </div>

      <SocialLoginButtons />

      <div className="mt-6 rounded-lg border border-dashed border-surface-border p-3">
        <p className="mb-2 text-xs font-medium text-slate-500">Quick demo login</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.role}
              type="button"
              variant="secondary"
              size="sm"
              isLoading={demoLoadingRole === account.role}
              onClick={() => handleDemoLogin(account)}
            >
              {account.role}
            </Button>
          ))}
        </div>
      </div>
    </AuthCard>
  );
}
