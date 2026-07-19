import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mlsa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getOne: (id) => api.get(`/events/${id}`),
  create: (formData) => api.post('/events', formData),
  update: (id, formData) => api.put(`/events/${id}`, formData),
  delete: (id) => api.delete(`/events/${id}`),
};

export const teamAPI = {
  getAll: () => api.get('/team'),
  getOne: (id) => api.get(`/team/${id}`),
  create: (formData) => api.post('/team', formData),
  update: (id, formData) => api.put(`/team/${id}`, formData),
  delete: (id) => api.delete(`/team/${id}`),
};

export default api;
