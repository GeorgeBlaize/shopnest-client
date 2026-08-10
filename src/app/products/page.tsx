'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/lib/apiClient';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/products/SearchBar';
import { Filters, type ProductFilters } from '@/components/products/Filters';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { Pagination } from '@/components/shared/Pagination';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Category, PaginatedResponse, Product } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
  });
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories').then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.rating, sort]);

  useEffect(() => {
    const query = {
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      rating: filters.rating || undefined,
      sort,
      page,
    };

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    router.replace(`/products?${params.toString()}`, { scroll: false });

    setIsLoading(true);
    api
      .get<PaginatedResponse<Product>>('/products', query)
      .then((data) => {
        setProducts(data.items);
        setTotalPages(data.meta.totalPages);
        setTotal(data.meta.total);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.rating, sort, page]);

  function handleClearFilters() {
    setFilters({ category: '', minPrice: '', maxPrice: '', rating: '' });
    setSearch('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <p className="mt-1 text-sm text-slate-500">Browse our full catalog and filter by what matters to you.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-2">
          <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <Filters categories={categories} filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} onClear={handleClearFilters} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-full overflow-y-auto bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X className="size-5" />
                </button>
              </div>
              <Filters categories={categories} filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} onClear={handleClearFilters} />
            </div>
          </div>
        )}

        <div>
          {!isLoading && (
            <p className="mb-4 text-sm text-slate-500">
              {total} product{total === 1 ? '' : 's'} found
            </p>
          )}

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-border py-16 text-center">
              <p className="font-medium">No products match your filters</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting or clearing your filters.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleClearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
          )}
        </div>
      </div>
    </div>
  );
}
