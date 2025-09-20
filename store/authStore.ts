import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; role: 'director' | 'teacher' | null } | null;
  login: (role: 'director' | 'teacher') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (role) => set({ isAuthenticated: true, user: { name: role === 'director' ? 'Director(a)' : 'Docente', role } }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
