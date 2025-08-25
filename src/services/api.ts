// Centralized HTTP helper so we can swap the base URL later (env/prod)
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text || path}`);
  }
  // json-server returns JSON for CRUD calls
  return res.json() as Promise<T>;
}

export { http };
