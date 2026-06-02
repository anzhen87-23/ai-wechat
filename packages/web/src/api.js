const API_BASE = import.meta.env.VITE_API_BASE || '/api';

let authToken = localStorage.getItem('token');

function getToken() {
  return authToken;
}

function setToken(token) {
  authToken = token;
  localStorage.setItem('token', token);
}

function clearToken() {
  authToken = null;
  localStorage.removeItem('token');
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const userApi = {
  search: (q) => api(`/users/search?q=${encodeURIComponent(q)}`),
  get: (id) => api(`/users/${id}`),
  getOnline: (id) => api(`/users/${id}/online`),
};

export const contactApi = {
  list: () => api('/contacts'),
  add: (friendId) => api('/contacts', { method: 'POST', body: JSON.stringify({ friendId }) }),
  remove: (friendId) => api(`/contacts/${friendId}`, { method: 'DELETE' }),
};

export const messageApi = {
  getHistory: (contactId, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api(`/messages/${contactId}${qs ? `?${qs}` : ''}`);
  },
};

export const profileApi = {
  get: () => api('/profile'),
  update: (data) => api('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export { getToken, setToken, clearToken };
