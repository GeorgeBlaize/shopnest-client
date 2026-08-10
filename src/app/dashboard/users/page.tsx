'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { api, ApiClientError } from '@/lib/apiClient';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { RequireRole } from '@/components/dashboard/RequireRole';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { PaginatedResponse, Role, User } from '@/types';

const ROLE_TONES: Record<Role, 'brand' | 'accent' | 'neutral'> = {
  ADMIN: 'brand',
  MANAGER: 'accent',
  USER: 'neutral',
};

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => setPage(1), [debouncedSearch, roleFilter]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<PaginatedResponse<User>>('/users', { search: debouncedSearch, role: roleFilter || undefined, page, limit: 10 })
      .then((data) => {
        setUsers(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearch, roleFilter, page]);

  async function handleRoleChange(user: User, role: Role) {
    setUpdatingId(user.id);
    try {
      await api.put(`/users/${user.id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
      toast.success(`${user.name} is now ${role}`);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update role');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not delete user');
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
        </div>
      ),
    },
    { key: 'joined', header: 'Joined', render: (u) => formatDate(u.createdAt) },
    {
      key: 'role',
      header: 'Role',
      render: (u) =>
        u.id === currentUser?.id ? (
          <Badge tone={ROLE_TONES[u.role]}>{u.role} (you)</Badge>
        ) : (
          <Select
            value={u.role}
            disabled={updatingId === u.id}
            onChange={(e) => handleRoleChange(u, e.target.value as Role)}
            className="h-8 max-w-32 text-xs"
            aria-label={`Change role for ${u.name}`}
          >
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (u) =>
        u.id === currentUser?.id ? null : (
          <button type="button" onClick={() => handleDelete(u)} aria-label={`Delete ${u.name}`} className="text-slate-500 hover:text-red-600">
            <Trash2 className="size-4" />
          </button>
        ),
    },
  ];

  return (
    <RequireRole roles={['ADMIN']}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-sm text-slate-500">View and manage all registered accounts</p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        getRowKey={(u) => u.id}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No users found."
        toolbar={
          <>
            <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-56" />
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="max-w-40">
              <option value="">All roles</option>
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </>
        }
      />
    </div>
    </RequireRole>
  );
}
