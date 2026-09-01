import { create } from 'zustand';
import { User, Store } from '@/types';

interface AuthState {
  user: User | null;
  store: Store | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  store: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setStore: (store) => set({ store }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, store: null, error: null }),
}));
