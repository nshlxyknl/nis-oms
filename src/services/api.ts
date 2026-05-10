const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include', // Important: sends cookies
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async (path: string, body: unknown) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: sends cookies
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  patch: async (path: string, body: unknown) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: sends cookies
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  delete: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: 'include', // Important: sends cookies
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};