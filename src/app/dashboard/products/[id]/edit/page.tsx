'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProductForm, type ProductFormValues } from '@/components/dashboard/ProductForm';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { api, ApiClientError } from '@/lib/apiClient';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get<{ product: Product }>(`/products/id/${params.id}`)
      .then((data) => setProduct(data.product))
      .catch(() => setNotFound(true));
  }, [params.id]);

  async function handleSubmit(values: ProductFormValues) {
    setServerError('');
    setIsSubmitting(true);
    try {
      await api.put(`/products/${params.id}`, values);
      toast.success('Product updated');
      router.push('/dashboard/products');
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Could not update product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
      {notFound ? (
        <p className="text-slate-500">Product not found.</p>
      ) : !product ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-sm text-slate-500">{product.title}</p>
          </div>
          {serverError && (
            <p className="max-w-2xl rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40">{serverError}</p>
          )}
          <ProductForm initialProduct={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" />
        </div>
      )}
    </RequireRole>
  );
}
