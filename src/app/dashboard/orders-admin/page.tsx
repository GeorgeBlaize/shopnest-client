'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { api, ApiClientError } from '@/lib/apiClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_TONES: Record<OrderStatus, 'neutral' | 'brand' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'neutral',
  PROCESSING: 'brand',
  SHIPPED: 'accent',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => setPage(1), [statusFilter]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<PaginatedResponse<Order>>('/orders', { status: statusFilter || undefined, page, limit: 10 })
      .then((data) => {
        setOrders(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .catch(() => {
        // Non-staff users get a 403 here and are redirected by RequireRole; nothing to show.
      })
      .finally(() => setIsLoading(false));
  }, [statusFilter, page]);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdatingId(order.id);
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      toast.success(`Order ${order.orderNumber} marked as ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  }

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order #', render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    { key: 'customer', header: 'Customer', render: (o) => o.user?.name || '—' },
    { key: 'date', header: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'items', header: 'Items', render: (o) => o.items.reduce((sum, i) => sum + i.quantity, 0) },
    { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
    {
      key: 'status',
      header: 'Status',
      render: (o) => (
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONES[o.status]}>{o.status}</Badge>
          <Select
            value={o.status}
            disabled={updatingId === o.id}
            onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
            className="h-8 max-w-36 text-xs"
            aria-label={`Update status for ${o.orderNumber}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      ),
    },
  ];

  return (
    <RequireRole roles={['ADMIN', 'MANAGER']}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <p className="text-sm text-slate-500">Review and update order statuses</p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        getRowKey={(o) => o.id}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No orders found."
        toolbar={
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-48">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        }
      />
    </div>
    </RequireRole>
  );
}
