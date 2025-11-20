'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

const PUBLIC_ROUTES = ['/landing', '/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loadUser, isLoading } = useAuthStore();

  // Cargar usuario al montar el componente si hay token
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // No hacer nada mientras está cargando - dar tiempo para que loadUser complete
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Solo redirigir si definitivamente no está autenticado y no es ruta pública
    // Verificar también si hay tokens en localStorage antes de redirigir
    const hasTokens = typeof window !== 'undefined' && 
      (localStorage.getItem('auth_token') || localStorage.getItem('refresh_token'));
    
    if (!isAuthenticated && !isPublicRoute && !hasTokens) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}



