const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const api = {
  get: async (path: string) => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async (path: string, body: unknown) => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  patch: async (path: string, body: unknown) => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  delete: async (path: string) => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};