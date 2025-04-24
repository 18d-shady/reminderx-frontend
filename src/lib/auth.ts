// lib/auth.ts
import api from './api';

export const login = async (username: string, password: string) => {
  const res = await api.post('/api/token/', { username, password });
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
  return res.data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await api.post('/api/register/', { username, email, password });
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
