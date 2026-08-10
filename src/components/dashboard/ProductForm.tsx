'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/apiClient';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { productSchema, type ProductInput } from '@/lib/validators';
import type { Category, Product } from '@/types';

export interface ProductFormValues {
  title: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  specs: Record<string, string>;
}

function specsToText(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}

function textToSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) specs[key.trim()] = rest.join(':').trim();
    });
  return specs;
}

export function ProductForm({
  initialProduct,
  onSubmit,
  isSubmitting,
  submitLabel,
}: {
  initialProduct?: Product;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories').then((data) => setCategories(data.categories));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialProduct
      ? {
          title: initialProduct.title,
          shortDesc: initialProduct.shortDesc,
          description: initialProduct.description,
          price: String(initialProduct.price),
          compareAtPrice: initialProduct.compareAtPrice ? String(initialProduct.compareAtPrice) : '',
          stock: String(initialProduct.stock),
          categoryId: initialProduct.categoryId,
          images: initialProduct.images.join('\n'),
          isFeatured: initialProduct.isFeatured,
          specs: specsToText(initialProduct.specs),
        }
      : { isFeatured: false },
  });

  function handleFormSubmit(values: ProductInput) {
    onSubmit({
      title: values.title,
      shortDesc: values.shortDesc,
      description: values.description,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
      stock: Number(values.stock),
      categoryId: values.categoryId,
      images: values.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured: Boolean(values.isFeatured),
      specs: textToSpecs(values.specs || ''),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="max-w-2xl space-y-4">
      <FormField id="title" label="Product title" required error={errors.title?.message}>
        <Input id="title" hasError={!!errors.title} {...register('title')} />
      </FormField>

      <FormField id="categoryId" label="Category" required error={errors.categoryId?.message}>
        <Select id="categoryId" hasError={!!errors.categoryId} {...register('categoryId')}>
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="shortDesc" label="Short description" required error={errors.shortDesc?.message} hint="Shown on product cards">
        <Input id="shortDesc" hasError={!!errors.shortDesc} {...register('shortDesc')} />
      </FormField>

      <FormField id="description" label="Full description" required error={errors.description?.message}>
        <Textarea id="description" rows={5} hasError={!!errors.description} {...register('description')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="price" label="Price ($)" required error={errors.price?.message}>
          <Input id="price" inputMode="decimal" hasError={!!errors.price} {...register('price')} />
        </FormField>
        <FormField id="compareAtPrice" label="Compare-at price ($)" error={errors.compareAtPrice?.message} hint="Optional, for showing a discount">
          <Input id="compareAtPrice" inputMode="decimal" hasError={!!errors.compareAtPrice} {...register('compareAtPrice')} />
        </FormField>
      </div>

      <FormField id="stock" label="Stock quantity" required error={errors.stock?.message}>
        <Input id="stock" inputMode="numeric" hasError={!!errors.stock} {...register('stock')} />
      </FormField>

      <FormField
        id="images"
        label="Image URLs"
        required
        error={errors.images?.message}
        hint="One image URL per line. The first line is used as the main image."
      >
        <Textarea id="images" rows={3} hasError={!!errors.images} {...register('images')} />
      </FormField>

      <FormField id="specs" label="Specifications" hint="One per line, formatted as Key: Value">
        <Textarea id="specs" rows={4} {...register('specs')} placeholder="Weight: 250g&#10;Warranty: 1 year" />
      </FormField>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-brand" {...register('isFeatured')} />
        Feature this product on the home page
      </label>

      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
