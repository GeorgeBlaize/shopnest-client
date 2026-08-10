'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import { api, ApiClientError } from '@/lib/apiClient';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency } from '@/lib/utils';
import type { Category, PaginatedResponse, Product } from '@/types';

export default function ManageProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories').then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => setPage(1), [debouncedSearch, category]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<PaginatedResponse<Product>>('/products', { search: debouncedSearch, category, page, limit: 10 })
      .then((data) => {
        setProducts(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearch, category, page]);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not delete product');
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: '',
      render: (p) => (
        <div className="relative size-12 overflow-hidden rounded-lg bg-white">
          <Image src={p.images[0]} alt={p.title} fill sizes="48px" className="object-cover" />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Product',
      render: (p) => (
        <div>
          <p className="line-clamp-1 font-medium">{p.title}</p>
          <StarRating value={p.avgRating} count={p.reviewCount} size={12} />
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (p) => <Badge tone="neutral">{p.category.name}</Badge> },
    { key: 'price', header: 'Price', render: (p) => formatCurrency(p.price) },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (p.stock === 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/products/${p.id}/edit`} aria-label={`Edit ${p.title}`} className="text-slate-500 hover:text-brand">
            <Pencil className="size-4" />
          </Link>
          {isAdmin && (
            <button type="button" onClick={() => handleDelete(p)} aria-label={`Delete ${p.title}`} className="text-slate-500 hover:text-red-600">
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-sm text-slate-500">{products.length} products on this page</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="size-4" /> Add Product
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        getRowKey={(p) => p.id}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No products found."
        toolbar={
          <>
            <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-56" />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-48">
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </>
        }
      />
    </div>
    </RequireRole>
  );
}
