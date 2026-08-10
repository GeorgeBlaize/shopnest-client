import type { ReactNode } from 'react';
import { Pagination } from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  toolbar?: ReactNode;
  emptyMessage?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading,
  toolbar,
  emptyMessage = 'No records found.',
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface">
      {toolbar && <div className="flex flex-wrap items-center gap-3 border-b border-surface-border p-4">{toolbar}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border text-xs uppercase text-slate-500">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-medium ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-full max-w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={getRowKey(row)} className="border-b border-surface-border last:border-0 hover:bg-background/60">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {page !== undefined && totalPages !== undefined && onPageChange && totalPages > 1 && (
        <div className="border-t border-surface-border p-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
