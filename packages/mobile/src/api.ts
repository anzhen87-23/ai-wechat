const API_BASE_URL = 'http://localhost:3001/api';

let authToken: string | null = null;

async function getToken(): Promise<string | null> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('token');
  } catch {
    return authToken;
  }
}

async function setToken(token: string) {
  authToken = token;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('token', token);
  } catch {}
}

async function clearToken() {
  authToken = null;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('token');
  } catch {}
}

async function api(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

export const authApi = {
  register: (data: any) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const contactApi = {
  list: () => api('/contacts'),
  add: (friendId: string) => api('/contacts', { method: 'POST', body: JSON.stringify({ friendId }) }),
  remove: (friendId: string) => api(`/contacts/${friendId}`, { method: 'DELETE' }),
};

export const messageApi = {
  getHistory: (contactId: string) => api(`/messages/${contactId}`),
};

export const userApi = {
  search: (q: string) => api(`/users/search?q=${encodeURIComponent(q)}`),
};

export const profileApi = {
  get: () => api('/profile'),
  update: (data: any) => api('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export { setToken, clearToken };
