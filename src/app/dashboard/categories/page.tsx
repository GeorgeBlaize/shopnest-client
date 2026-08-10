'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, ApiClientError } from '@/lib/apiClient';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { categorySchema, type CategoryInput } from '@/lib/validators';
import type { Category } from '@/types';

export default function ManageCategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  function loadCategories() {
    setIsLoading(true);
    api
      .get<{ categories: Category[] }>('/categories')
      .then((data) => setCategories(data.categories))
      .finally(() => setIsLoading(false));
  }

  useEffect(loadCategories, []);

  function openCreateForm() {
    setEditing(null);
    reset({ name: '', imageUrl: '' });
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditing(category);
    reset({ name: category.name, imageUrl: category.imageUrl });
    setShowForm(true);
  }

  async function onSubmit(values: CategoryInput) {
    setIsSubmitting(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, values);
        toast.success('Category updated');
      } else {
        await api.post('/categories', values);
        toast.success('Category created');
      }
      setShowForm(false);
      loadCategories();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not save category');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Delete "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      toast.success('Category deleted');
      loadCategories();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not delete category');
    }
  }

  const columns: Column<Category>[] = [
    {
      key: 'image',
      header: '',
      render: (c) => (
        <div className="relative size-12 overflow-hidden rounded-lg bg-white">
          <Image src={c.imageUrl} alt={c.name} fill sizes="48px" className="object-cover" />
        </div>
      ),
    },
    { key: 'name', header: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
    { key: 'products', header: 'Products', render: (c) => c._count?.products ?? 0 },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: '',
            render: (c: Category) => (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => openEditForm(c)} aria-label={`Edit ${c.name}`} className="text-slate-500 hover:text-brand">
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => handleDelete(c)} aria-label={`Delete ${c.name}`} className="text-slate-500 hover:text-red-600">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-slate-500">{categories.length} categories</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreateForm}>
            <Plus className="size-4" /> Add Category
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <Card className="max-w-lg p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editing ? 'Edit Category' : 'New Category'}</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="size-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField id="name" label="Category name" required error={errors.name?.message}>
              <Input id="name" hasError={!!errors.name} {...register('name')} />
            </FormField>
            <FormField id="imageUrl" label="Image URL" required error={errors.imageUrl?.message}>
              <Input id="imageUrl" hasError={!!errors.imageUrl} {...register('imageUrl')} />
            </FormField>
            <Button type="submit" isLoading={isSubmitting}>
              {editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </form>
        </Card>
      )}

      <DataTable columns={columns} data={categories} getRowKey={(c) => c.id} isLoading={isLoading} emptyMessage="No categories yet." />
    </div>
    </RequireRole>
  );
}
