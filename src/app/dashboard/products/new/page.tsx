'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProductForm, type ProductFormValues } from '@/components/dashboard/ProductForm';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { api, ApiClientError } from '@/lib/apiClient';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(values: ProductFormValues) {
    setServerError('');
    setIsSubmitting(true);
    try {
      await api.post('/products', values);
      toast.success('Product created');
      router.push('/dashboard/products');
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Could not create product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-slate-500">Create a new product listing</p>
        </div>
        {serverError && <p className="max-w-2xl rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40">{serverError}</p>}
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Product" />
      </div>
    </RequireRole>
  );
}
