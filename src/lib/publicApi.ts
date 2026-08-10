const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// For public, unauthenticated GET requests made from Server Components.
export async function publicApiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data as T;
  } catch {
    return null;
  }
}
