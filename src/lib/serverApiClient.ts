import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Server Component variant of apiClient: forwards the incoming request's
// cookies so authenticated calls (e.g. /auth/me) work during SSR.
export async function serverApiGet<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API_URL}${path}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const payload = await res.json();
  return payload?.data as T;
}
