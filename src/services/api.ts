const BASE_URL = import.meta.env.VITE_API_URL || 'https://admin-cms-back.onrender.com';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('uhs_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Services
export const servicesApi = {
  getAll: (admin = false) => request<any[]>(`/services${admin ? '?admin=true' : ''}`),
  create: (data: any) => request<any>('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/services/${id}`, { method: 'DELETE' }),
};

// Admins
export const adminsApi = {
  getAll: () => request<any[]>('/admins'),
  create: (data: any) => request<any>('/admins', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/admins/${id}`, { method: 'DELETE' }),
};

// Messages
export const messagesApi = {
  getAll: () => request<any[]>('/messages'),
  create: (data: any) => request<any>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  markRead: (id: number) => request<any>(`/messages/${id}/read`, { method: 'PATCH' }),
  delete: (id: number) => request<any>(`/messages/${id}`, { method: 'DELETE' }),
};

// Gallery
export const galleryApi = {
  getAll: (category?: string) => request<any[]>(`/gallery${category ? `?category=${category}` : ''}`),
  create: (data: any) => request<any>('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/gallery/${id}`, { method: 'DELETE' }),
};

// Pages
export const pagesApi = {
  getAll: (page?: string) => request<any[]>(`/pages${page ? `?page=${page}` : ''}`),
  create: (data: any) => request<any>('/pages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/pages/${id}`, { method: 'DELETE' }),
};
