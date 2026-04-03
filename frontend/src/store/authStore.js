import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  async fetchMe() {
    try {
      const res = await api.get('/auth/me');
      set({ user: res?.data?.user || null, error: null });
    } catch (err) {
      set({ user: null, error: null });
    }
  },

  async signup({ username, password }) {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/signup', { username, password });
      set({ user: res?.data?.user || null, loading: false, error: null });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Signup failed';
      set({ loading: false, error: msg });
    }
  },

  async login({ username, password }) {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { username, password });
      set({ user: res?.data?.user || null, loading: false, error: null });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Login failed';
      set({ loading: false, error: msg });
    }
  },

  async logout() {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    set({ user: null, loading: false, error: null });
  },
}));

