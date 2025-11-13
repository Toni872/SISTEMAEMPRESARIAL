import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'USER' | 'READONLY';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

// Usuarios mock para desarrollo
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@erp.com',
    password: 'admin123',
    name: 'Antonio Administrador',
    role: 'ADMIN' as const,
  },
  {
    id: '2',
    email: 'usuario@erp.com',
    password: 'usuario123',
    name: 'María Usuario',
    role: 'USER' as const,
  },
  {
    id: '3',
    email: 'manager@erp.com',
    password: 'manager123',
    name: 'Carlos Manager',
    role: 'MANAGER' as const,
  },
  {
    id: '4',
    email: 'demo@erp.com',
    password: 'demo123',
    name: 'Demo Usuario',
    role: 'USER' as const,
  },
];

// Simulación de usuarios registrados (en producción esto estaría en una base de datos)
let registeredUsers = [...MOCK_USERS];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = registeredUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }

        return false;
      },

      register: async (email: string, password: string, name: string) => {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verificar si el usuario ya existe
        const existingUser = registeredUsers.find((u) => u.email === email);
        if (existingUser) {
          return false;
        }

        // Crear nuevo usuario
        const newUser = {
          id: String(registeredUsers.length + 1),
          email,
          password,
          name,
          role: 'USER' as const,
        };

        registeredUsers.push(newUser);

        // Auto-login después del registro
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);



