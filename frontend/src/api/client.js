const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('roxiler_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An unexpected error occurred.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    signup: (userData) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => apiRequest('/auth/me'),
    changePassword: (passwords) =>
      apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      }),
  },
  admin: {
    getStats: () => apiRequest('/admin/dashboard'),
    getUsers: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
    },
    addUser: (userData) =>
      apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getStores: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/admin/stores${query ? `?${query}` : ''}`);
    },
    addStore: (storeData) =>
      apiRequest('/admin/stores', {
        method: 'POST',
        body: JSON.stringify(storeData),
      }),
  },
  stores: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/stores${query ? `?${query}` : ''}`);
    },
  },
  ratings: {
    submit: (ratingData) =>
      apiRequest('/ratings', {
        method: 'POST',
        body: JSON.stringify(ratingData),
      }),
  },
  owner: {
    getDashboard: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/owner/dashboard${query ? `?${query}` : ''}`);
    },
  },
};
