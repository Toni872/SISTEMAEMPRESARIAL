/**
 * API Service - Cliente para comunicarse con el backend FastAPI
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  name: string | null;
}

interface UserResponse {
  id: number;
  email: string;
  name: string | null;
}

interface ApiError {
  detail: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch (e) {
          // Si no se puede parsear JSON, usar el mensaje por defecto
          console.error('Error parsing response:', e);
        }
        console.error(`API Error [${response.status}]:`, errorMessage, 'URL:', url);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Attempting login with email:', email);
    console.log('Password length:', password.length);
    const body = JSON.stringify({ email, password });
    console.log('Request body:', body.replace(/"(password)":"[^"]+"/, '"$1":"***"'));
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body,
    });
    this.setToken(response.access_token);
    return response;
  }

  /**
   * Registrar nuevo usuario
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    return response;
  }

  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/auth/me');
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.removeToken();
  }

  /**
   * Verificar si hay un token guardado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const apiClient = new ApiClient();

