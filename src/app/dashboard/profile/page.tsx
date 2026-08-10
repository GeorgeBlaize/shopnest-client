'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api, ApiClientError } from '@/lib/apiClient';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { profileSchema, type ProfileInput } from '@/lib/validators';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone || '', avatarUrl: user.avatarUrl || '' });
    }
  }, [user, reset]);

  async function onSubmit(values: ProfileInput) {
    setServerError('');
    try {
      await api.put('/users/profile', {
        name: values.name,
        phone: values.phone || undefined,
        avatarUrl: values.avatarUrl || undefined,
      });
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Could not update profile');
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal information</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-xl font-semibold text-brand">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <Badge tone="brand" className="mt-1">
              {user.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField id="name" label="Full name" required error={errors.name?.message}>
            <Input id="name" hasError={!!errors.name} {...register('name')} />
          </FormField>
          <FormField id="email" label="Email address" hint="Email address cannot be changed">
            <Input id="email" value={user.email} disabled />
          </FormField>
          <FormField id="phone" label="Phone number" error={errors.phone?.message}>
            <Input id="phone" hasError={!!errors.phone} {...register('phone')} />
          </FormField>
          <FormField id="avatarUrl" label="Avatar URL" error={errors.avatarUrl?.message} hint="Paste a link to your profile picture">
            <Input id="avatarUrl" hasError={!!errors.avatarUrl} {...register('avatarUrl')} />
          </FormField>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
