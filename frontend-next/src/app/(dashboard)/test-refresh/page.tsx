'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function TestRefreshPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [tokenInfo, setTokenInfo] = useState<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenLength: number;
    refreshTokenLength: number;
  } | null>(null);

  const checkTokens = () => {
    if (typeof window === 'undefined') return;
    
    const accessToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    setTokenInfo({
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0,
    });
  };

  const testRefreshToken = async () => {
    setStatus('testing');
    setMessage('Probando refresh token automático...');

    try {
      // Primero verificar tokens actuales
      checkTokens();

      // Hacer una llamada que debería funcionar
      setMessage('Haciendo request inicial...');
      const userData = await apiClient.getCurrentUser();
      setMessage(`Usuario obtenido: ${userData.email}`);

      // Intentar refrescar manualmente para verificar que funciona
      setMessage('Refrescando tokens manualmente...');
      const refreshed = await apiClient.refreshTokens();
      setMessage('Tokens refrescados exitosamente!');
      
      checkTokens();
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Error desconocido');
      console.error('Error en test:', error);
    }
  };

  const testAutoRefresh = async () => {
    setStatus('testing');
    setMessage('Simulando token expirado...');

    try {
      // Guardar token actual
      const currentToken = localStorage.getItem('auth_token');
      
      // Invalidar temporalmente el token (simular expiración)
      if (currentToken) {
        // Modificar el token para que sea inválido
        localStorage.setItem('auth_token', 'invalid_token_for_testing');
        setMessage('Token invalidado. Haciendo request que debería fallar...');
      }

      // Hacer un request que debería fallar y activar el refresh automático
      try {
        await apiClient.getCurrentUser();
        setMessage('Request exitoso después del refresh automático!');
        checkTokens();
        setStatus('success');
      } catch (error: any) {
        // Si el refresh automático funcionó, debería restaurar el token
        const restoredToken = localStorage.getItem('auth_token');
        if (restoredToken && restoredToken !== 'invalid_token_for_testing') {
          setMessage('Refresh automático funcionó! Token restaurado.');
          checkTokens();
          setStatus('success');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Error en la prueba');
      console.error('Error en test auto-refresh:', error);
    }
  };

  const clearTokens = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    checkTokens();
    setMessage('Tokens limpiados');
  };

  // Verificar tokens al cargar
  useEffect(() => {
    checkTokens();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No autenticado</CardTitle>
            <CardDescription>Por favor inicia sesión para probar el refresh token</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'}>
              Ir al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prueba de Refresh Token</h1>
        <p className="text-muted-foreground">
          Prueba el sistema de renovación automática de tokens
        </p>
      </div>

      {/* Estado de autenticación */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Usuario:</span>
            <Badge variant="default">{user?.email || 'N/A'}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Autenticado:</span>
            <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
              {isAuthenticated ? 'Sí' : 'No'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información de tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Tokens</CardTitle>
          <CardDescription>Estado actual de los tokens almacenados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tokenInfo ? (
            <>
              <div className="flex items-center justify-between">
                <span>Access Token:</span>
                <div className="flex items-center gap-2">
                  {tokenInfo.hasAccessToken ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {tokenInfo.accessTokenLength} caracteres
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">No encontrado</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Refresh Token:</span>
                <div className="flex items-center gap-2">
                  {tokenInfo.hasRefreshToken ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {tokenInfo.refreshTokenLength} caracteres
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">No encontrado</span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}
          <Button onClick={checkTokens} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>
        </CardContent>
      </Card>

      {/* Pruebas */}
      <Card>
        <CardHeader>
          <CardTitle>Pruebas</CardTitle>
          <CardDescription>Ejecuta pruebas para verificar el funcionamiento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={testRefreshToken}
              disabled={status === 'testing'}
              className="w-full"
            >
              {status === 'testing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Probar Refresh Manual
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Prueba la renovación manual de tokens
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={testAutoRefresh}
              disabled={status === 'testing'}
              variant="outline"
              className="w-full"
            >
              {status === 'testing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Probar Refresh Automático
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Simula token expirado y verifica el refresh automático
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={clearTokens}
              variant="destructive"
              className="w-full"
            >
              Limpiar Tokens
            </Button>
            <p className="text-xs text-muted-foreground">
              Elimina todos los tokens (útil para pruebas)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
              {status === 'testing' && <Loader2 className="w-5 h-5 animate-spin" />}
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={status === 'success' ? 'text-green-600 dark:text-green-400' : status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}>
              {message || 'Sin mensaje'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

