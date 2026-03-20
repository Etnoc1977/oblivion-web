const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('oblivion_token');
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function api(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    ...options,
  });
  const data = await res.json();
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oblivion_token');
      localStorage.removeItem('oblivion_user');
      window.location.href = '/login';
    }
  }
  return data;
}

export async function login(email, password) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.success) {
    localStorage.setItem('oblivion_token', data.data.token);
    localStorage.setItem('oblivion_user', JSON.stringify(data.data.user));
  }
  return data;
}

export async function register(email, password, fullName, company) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, company }),
  });
  if (data.success) {
    localStorage.setItem('oblivion_token', data.data.token);
    localStorage.setItem('oblivion_user', JSON.stringify(data.data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('oblivion_token');
  localStorage.removeItem('oblivion_user');
  window.location.href = '/login';
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('oblivion_user'));
  } catch { return null; }
}

export function isLoggedIn() {
  return !!getToken();
}

export function isAdmin() {
  const user = getUser();
  return user?.role === 'admin';
}
