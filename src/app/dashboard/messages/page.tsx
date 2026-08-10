'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiClientError } from '@/lib/apiClient';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { ContactMessage, PaginatedResponse } from '@/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    setIsLoading(true);
    api
      .get<PaginatedResponse<ContactMessage>>('/contact', { page, limit: 10 })
      .then((data) => {
        setMessages(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [page]);

  const filtered = messages.filter((m) => {
    if (filter === 'resolved') return m.resolved;
    if (filter === 'unresolved') return !m.resolved;
    return true;
  });

  async function handleResolve(message: ContactMessage) {
    try {
      await api.patch(`/contact/${message.id}/resolve`);
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, resolved: true } : m)));
      toast.success('Marked as resolved');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update message');
    }
  }

  const columns: Column<ContactMessage>[] = [
    {
      key: 'from',
      header: 'From',
      render: (m) => (
        <div>
          <p className="font-medium">{m.name}</p>
          <p className="text-xs text-slate-500">{m.email}</p>
        </div>
      ),
    },
    { key: 'subject', header: 'Subject', render: (m) => m.subject },
    { key: 'message', header: 'Message', className: 'max-w-xs', render: (m) => <span className="line-clamp-2">{m.message}</span> },
    { key: 'date', header: 'Date', render: (m) => formatDate(m.createdAt) },
    {
      key: 'status',
      header: 'Status',
      render: (m) =>
        m.resolved ? (
          <Badge tone="success">Resolved</Badge>
        ) : (
          <button type="button" onClick={() => handleResolve(m)} className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
            <CheckCircle2 className="size-3.5" /> Mark resolved
          </button>
        ),
    },
  ];

  return (
    <RequireRole roles={['ADMIN']}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-slate-500">Contact form submissions from customers</p>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowKey={(m) => m.id}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No messages found."
        toolbar={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-44">
            <option value="">All messages</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </Select>
        }
      />
    </div>
    </RequireRole>
  );
}
