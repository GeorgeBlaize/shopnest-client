const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export class ApiClientError extends Error {
  statusCode: number;
  details: ApiErrorDetail[] | null;

  constructor(statusCode: number, message: string, details: ApiErrorDetail[] | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query } = options;

  const res = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      payload?.message || 'Something went wrong. Please try again.',
      payload?.details || null
    );
  }

  return payload?.data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) => apiFetch<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
