'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/apiClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';

const STATUS_TONES: Record<OrderStatus, 'neutral' | 'brand' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'neutral',
  PROCESSING: 'brand',
  SHIPPED: 'accent',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api
      .get<PaginatedResponse<Order>>('/orders/mine', { page, limit: 10 })
      .then((data) => {
        setOrders(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order #', render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    { key: 'date', header: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'items', header: 'Items', render: (o) => o.items.reduce((sum, i) => sum + i.quantity, 0) },
    { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
    { key: 'status', header: 'Status', render: (o) => <Badge tone={STATUS_TONES[o.status]}>{o.status}</Badge> },
    {
      key: 'action',
      header: '',
      render: (o) => (
        <Link href={`/checkout/confirmation/${o.id}`} className="text-sm font-medium text-brand hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-slate-500">Track and review your past orders</p>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowKey={(o) => o.id}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No orders match your filters."
        toolbar={
          <>
            <Input
              placeholder="Search by order number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-56"
            />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-40">
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </>
        }
      />
    </div>
  );
}
