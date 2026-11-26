import { TOURS as FALLBACK_TOURS } from '../data/tours';
import { DESTINATIONS as FALLBACK_DESTINATIONS } from '../data/destinations';
import { BLOG_POSTS as FALLBACK_BLOG } from '../data/blog';

const TOKEN_KEY = 'ora_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (options.auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function uploadAdminImage(file) {
  const token = getAdminToken();
  const form = new FormData();
  form.append('image', file);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  return data.url;
}

// Public content (reads from Prisma API, gracefully falls back to static data if API is offline)
export async function fetchTours() {
  try {
    const data = await request('/api/tours');
    return Array.isArray(data) && data.length ? data : FALLBACK_TOURS;
  } catch {
    return FALLBACK_TOURS;
  }
}

export async function fetchTourBySlug(slug) {
  try {
    return await request(`/api/tours/${encodeURIComponent(slug)}`);
  } catch {
    return FALLBACK_TOURS.find((t) => t.id === slug) || null;
  }
}

export async function fetchDestinations() {
  try {
    const data = await request('/api/destinations');
    return Array.isArray(data) && data.length ? data : FALLBACK_DESTINATIONS;
  } catch {
    return FALLBACK_DESTINATIONS;
  }
}

export async function fetchBlogPosts() {
  try {
    const data = await request('/api/blog');
    return Array.isArray(data) && data.length ? data : FALLBACK_BLOG;
  } catch {
    return FALLBACK_BLOG;
  }
}

export async function fetchSiteSettings() {
  try {
    return await request('/api/settings');
  } catch {
    return {};
  }
}

// Public form submissions (saved to Prisma database)
export function submitBookingForm(payload) {
  return request('/api/forms/booking', { method: 'POST', body: payload });
}

export function submitContactForm(payload) {
  return request('/api/forms/contact', { method: 'POST', body: payload });
}

export function submitNewsletterForm(payload) {
  return request('/api/forms/newsletter', { method: 'POST', body: payload });
}

// Admin API
export const adminApi = {
  login: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/admin/me', { auth: true }),
  stats: () => request('/api/admin/stats', { auth: true }),

  getBookings: () => request('/api/admin/bookings', { auth: true }),
  updateBooking: (id, body) => request(`/api/admin/bookings/${id}`, { method: 'PATCH', body, auth: true }),
  deleteBooking: (id) => request(`/api/admin/bookings/${id}`, { method: 'DELETE', auth: true }),
  replyBooking: (id, message) => request(`/api/admin/bookings/${id}/reply`, { method: 'POST', body: { message }, auth: true }),

  getContacts: () => request('/api/admin/contacts', { auth: true }),
  updateContact: (id, body) => request(`/api/admin/contacts/${id}`, { method: 'PATCH', body, auth: true }),
  deleteContact: (id) => request(`/api/admin/contacts/${id}`, { method: 'DELETE', auth: true }),
  replyContact: (id, message) => request(`/api/admin/contacts/${id}/reply`, { method: 'POST', body: { message }, auth: true }),

  getSubscribers: () => request('/api/admin/subscribers', { auth: true }),
  deleteSubscriber: (id) => request(`/api/admin/subscribers/${id}`, { method: 'DELETE', auth: true }),

  createTour: (body) => request('/api/admin/tours', { method: 'POST', body, auth: true }),
  updateTour: (id, body) => request(`/api/admin/tours/${id}`, { method: 'PUT', body, auth: true }),
  deleteTour: (id) => request(`/api/admin/tours/${id}`, { method: 'DELETE', auth: true }),

  createDestination: (body) => request('/api/admin/destinations', { method: 'POST', body, auth: true }),
  updateDestination: (id, body) => request(`/api/admin/destinations/${id}`, { method: 'PUT', body, auth: true }),
  deleteDestination: (id) => request(`/api/admin/destinations/${id}`, { method: 'DELETE', auth: true }),

  createBlog: (body) => request('/api/admin/blog', { method: 'POST', body, auth: true }),
  updateBlog: (id, body) => request(`/api/admin/blog/${id}`, { method: 'PUT', body, auth: true }),
  deleteBlog: (id) => request(`/api/admin/blog/${id}`, { method: 'DELETE', auth: true }),

  updateSettings: (body) => request('/api/admin/settings', { method: 'PUT', body, auth: true }),
};
