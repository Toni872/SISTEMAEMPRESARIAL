import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from './api';

interface User {
  id: number;
  email: string;
  name: string | null;
  role?: 'ADMIN' | 'MANAGER' | 'USER' | 'READONLY'; // Opcional por ahora
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Login en el backend
          await apiClient.login(email, password);
          
          // Obtener información del usuario
          const userData = await apiClient.getCurrentUser();
          
          set({
            user: {
              ...userData,
              role: 'USER' as const, // Por defecto, se puede mejorar después
            },
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          // Registrar en el backend
          const userData = await apiClient.register(email, password, name);
          
          // Hacer login automático después del registro
          await apiClient.login(email, password);
          
          set({
            user: {
              ...userData,
              role: 'USER' as const,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          console.error('Register error:', error);
          set({ isLoading: false });
          
          // Manejar error específico de email duplicado
          if (error.message?.includes('already registered')) {
            throw new Error('Este email ya está registrado');
          }
          
          return false;
        }
      },

      logout: () => {
        apiClient.logout();
        set({ user: null, isAuthenticated: false });
      },

      loadUser: async () => {
        if (!apiClient.isAuthenticated()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const userData = await apiClient.getCurrentUser();
          set({
            user: {
              ...userData,
              role: 'USER' as const,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Load user error:', error);
          // Token inválido o expirado
          apiClient.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir el usuario, no el estado de loading
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);



