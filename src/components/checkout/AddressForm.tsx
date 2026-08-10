'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { addressSchema, type AddressInput } from '@/lib/validators';

export function AddressForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: {
  onSubmit: (values: AddressInput) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema), defaultValues: { isDefault: false } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="label" label="Address label" required error={errors.label?.message}>
          <Input id="label" placeholder="Home, Office…" hasError={!!errors.label} {...register('label')} />
        </FormField>
        <FormField id="phone" label="Phone number" required error={errors.phone?.message}>
          <Input id="phone" hasError={!!errors.phone} {...register('phone')} />
        </FormField>
      </div>
      <FormField id="line1" label="Street address" required error={errors.line1?.message}>
        <Input id="line1" hasError={!!errors.line1} {...register('line1')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="city" label="City" required error={errors.city?.message}>
          <Input id="city" hasError={!!errors.city} {...register('city')} />
        </FormField>
        <FormField id="state" label="State" required error={errors.state?.message}>
          <Input id="state" hasError={!!errors.state} {...register('state')} />
        </FormField>
        <FormField id="postalCode" label="Postal code" required error={errors.postalCode?.message}>
          <Input id="postalCode" hasError={!!errors.postalCode} {...register('postalCode')} />
        </FormField>
      </div>
      <FormField id="country" label="Country" required error={errors.country?.message}>
        <Input id="country" hasError={!!errors.country} {...register('country')} />
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-brand" {...register('isDefault')} />
        Set as default address
      </label>
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          Save Address
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
