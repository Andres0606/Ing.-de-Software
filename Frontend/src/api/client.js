export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, options = {}) {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const init = { ...options, headers };
  const res = await fetch(url, init);
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text().catch(() => null);
  }
  if (!res.ok) {
    const message = data?.error || res.statusText || 'Error de API';
    throw new Error(message);
  }
  return data;
}
