/**
 * API Service - Cliente para comunicarse con el backend FastAPI
 */

import { logger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
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
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
    logger.debug('API Client inicializado', { url: this.baseUrl });
  }

  /**
   * Renovar access token usando refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    // Si ya hay un refresh en proceso, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const url = `${this.baseUrl}/api/auth/refresh`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          // Refresh token inválido o expirado
          this.removeToken();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
        }

        const data: LoginResponse = await response.json();
        this.setToken(data.access_token);
        if (data.refresh_token) {
          this.setRefreshToken(data.refresh_token);
        }

        return data.access_token;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // Agregar timeout a las requests (30 segundos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si recibimos 401 y tenemos refresh token, intentar renovar
      if (response.status === 401 && this.getRefreshToken() && retryCount === 0) {
        try {
          // Renovar token
          const newToken = await this.refreshAccessToken();

          // Reintentar request con nuevo token
          const retryHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          };

          // Agregar timeout también al retry
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 30000);

          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
            signal: retryController.signal,
          });

          clearTimeout(retryTimeoutId);

          if (!retryResponse.ok) {
            let errorMessage = `Error ${retryResponse.status}: ${retryResponse.statusText}`;
            try {
              const error: ApiError = await retryResponse.json();
              errorMessage = error.detail || errorMessage;
            } catch (e) {
              logger.error('Error parsing response', e);
            }
            logger.error(`API Error [${retryResponse.status}]`, { message: errorMessage, url });
            throw new Error(errorMessage);
          }

          return await retryResponse.json();
        } catch (refreshError) {
          // Si el refresh falla, hacer logout automático
          this.removeToken();
          if (refreshError instanceof Error) {
            throw refreshError;
          }
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
        }
      }

      // Manejar respuestas vacías (204 No Content) antes de verificar errores
      if (response.status === 204 || response.statusText === 'No Content') {
        return null as T;
      }

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          // Clonar la respuesta para poder leerla sin consumir el stream original
          const clonedResponse = response.clone();
          const error: ApiError = await clonedResponse.json();
          errorMessage = error.detail || errorMessage;
        } catch (e) {
          // Si no se puede parsear JSON, usar el mensaje por defecto
          logger.error('Error parsing response', e);
        }
        logger.error(`API Error [${response.status}]`, { message: errorMessage, url });
        throw new Error(errorMessage);
      }

      // Verificar si hay contenido antes de parsear JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null as T;
      }

      // Intentar parsear JSON, pero manejar respuestas vacías
      try {
        const text = await response.text();
        if (!text || text.trim() === '') {
          return null as T;
        }
        return JSON.parse(text);
      } catch (e) {
        // Si no se puede parsear, retornar null en lugar de lanzar error
        logger.warn('Could not parse JSON response, returning null', e);
        return null as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        // Manejar errores de timeout/abort
        if (error.name === 'AbortError') {
          throw new Error('La solicitud tardó demasiado. Por favor, intenta nuevamente.');
        }
        // Mejorar mensaje de error para conexión fallida
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
          const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
          if (isVercel) {
            throw new Error('El backend no está disponible. Para desarrollo, configura NEXT_PUBLIC_API_URL en Vercel o usa ngrok para conectar tu backend local.');
          }
          // Evitar mensajes genéricos del navegador sobre VPN/internet
          if (error.message.includes('VPN') || error.message.includes('internet connection')) {
            throw new Error('Error de conexión con el backend. Verifica que el servidor esté corriendo en http://localhost:8000');
          }
          throw new Error('⚠️ Backend no disponible. Para iniciar el backend:\n\n1. Opción Docker: docker-compose -f docker-compose.backend.yml up -d\n2. Opción Manual: cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\n\nVer SOLUCION_ERROR_BACKEND.md para más detalles.');
        }
        // Filtrar mensajes genéricos sobre VPN/internet
        if (error.message.includes('VPN') || error.message.includes('internet connection')) {
          throw new Error('Error de conexión con el backend. Verifica que el servidor esté corriendo y accesible.');
        }
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

  private setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Iniciar sesión
   * Usa form-data porque el backend espera OAuth2PasswordRequestForm
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // OAuth2 usa 'username' para email
      formData.append('password', password);

      const url = `${this.baseUrl}/api/auth/login`;
      
      // Agregar timeout a la request (30 segundos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch (e) {
          logger.error('Error parsing response', e);
        }
        
        // Mensajes más específicos para errores comunes
        if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Revisa los logs del backend o contacta al administrador.';
        } else if (response.status === 401) {
          errorMessage = errorMessage || 'Email o contraseña incorrectos';
        }
        
        logger.error(`API Error [${response.status}]`, { message: errorMessage, url });
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      this.setToken(data.access_token);
      if (data.refresh_token) {
        this.setRefreshToken(data.refresh_token);
      }
      return data;
    } catch (error) {
      // Manejar errores de timeout/abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Verifica que el backend esté corriendo en http://localhost:8000');
      }
      
      // Manejar errores de conexión específicamente
      if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed'))) {
        const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        if (isVercel) {
          if (apiUrl.includes('localhost')) {
            throw new Error('⚠️ El backend no está configurado en Vercel. Configura la variable NEXT_PUBLIC_API_URL en Settings → Environment Variables. Para desarrollo con backend local, usa ngrok.');
          }
          throw new Error(`No se puede conectar con el backend en ${apiUrl}. Verifica que esté desplegado y accesible.`);
        }
        
        // Mensaje más específico para desarrollo local
        throw new Error('No se puede conectar con el backend. Verifica que: 1) El backend esté corriendo en http://localhost:8000, 2) No haya problemas de firewall o antivirus bloqueando la conexión, 3) La variable NEXT_PUBLIC_API_URL esté configurada correctamente.');
      }
      
      // Si el error ya tiene un mensaje útil, propagarlo
      if (error instanceof Error) {
        // Evitar mensajes genéricos del navegador sobre VPN/internet
        if (error.message.includes('VPN') || error.message.includes('internet connection')) {
          throw new Error('Error de conexión con el backend. Verifica que el servidor esté corriendo y accesible en http://localhost:8000');
        }
        throw error;
      }
      throw new Error('Error desconocido al intentar iniciar sesión');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
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

  /**
   * Obtener estadísticas de ventas
   */
  async getSalesStats(startDate?: string, endDate?: string): Promise<{
    total_sales: number;
    total_revenue: number;
    total_items_sold: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const queryString = params.toString();
    const endpoint = `/api/sales/stats${queryString ? `?${queryString}` : ''}`;
    return this.request<{
      total_sales: number;
      total_revenue: number;
      total_items_sold: number;
    }>(endpoint);
  }

  /**
   * Obtener ventas recientes (alias para compatibilidad)
   */
  async getSales(skip: number = 0, limit: number = 10, status?: string, startDate?: string, endDate?: string): Promise<any[]> {
    return this.getSalesWithFilters(skip, limit, status, startDate, endDate);
  }

  /**
   * Obtener conteo de productos
   */
  async getProductsCount(isActive?: boolean): Promise<{ count: number }> {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('is_active', isActive.toString());

    const queryString = params.toString();
    const endpoint = `/api/products/count${queryString ? `?${queryString}` : ''}`;
    return this.request<{ count: number }>(endpoint);
  }

  /**
   * Obtener productos con stock bajo
   */
  async getLowStockProducts(): Promise<any[]> {
    return this.request<any[]>(`/api/products/low-stock`);
  }

  /**
   * Obtener productos recientes
   */
  async getProducts(skip: number = 0, limit: number = 10, search?: string, category?: string): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const queryString = params.toString();
    return this.request<any[]>(`/api/products?${queryString}`);
  }

  /**
   * Obtener un producto por ID
   */
  async getProduct(id: number): Promise<any> {
    return this.request<any>(`/api/products/${id}`);
  }

  /**
   * Crear un nuevo producto
   */
  async createProduct(product: {
    name: string;
    description?: string;
    sku?: string;
    price: number;
    cost?: number;
    stock?: number;
    min_stock?: number;
    category?: string;
    is_active?: boolean;
  }): Promise<any> {
    return this.request<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  /**
   * Actualizar un producto
   */
  async updateProduct(id: number, product: {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    cost?: number;
    stock?: number;
    min_stock?: number;
    category?: string;
    is_active?: boolean;
  }): Promise<any> {
    return this.request<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  /**
   * Eliminar un producto
   */
  async deleteProduct(id: number): Promise<void> {
    await this.request<void>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtener ventas (versión completa con filtros)
   */
  async getSalesWithFilters(skip: number = 0, limit: number = 100, status?: string, startDate?: string, endDate?: string): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const queryString = params.toString();
    return this.request<any[]>(`/api/sales?${queryString}`);
  }

  /**
   * Obtener una venta por ID
   */
  async getSale(id: number): Promise<any> {
    return this.request<any>(`/api/sales/${id}`);
  }

  /**
   * Crear una nueva venta
   */
  async createSale(sale: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    notes?: string;
    status?: string;
    items: Array<{
      product_id: number;
      quantity: number;
      unit_price: number;
    }>;
  }): Promise<any> {
    return this.request<any>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
  }

  /**
   * Actualizar una venta
   */
  async updateSale(id: number, sale: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    notes?: string;
    status?: string;
  }): Promise<any> {
    return this.request<any>(`/api/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sale),
    });
  }

  /**
   * Eliminar una venta
   */
  async deleteSale(id: number): Promise<void> {
    await this.request<void>(`/api/sales/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Renovar tokens manualmente (útil para testing o refresh proactivo)
   */
  async refreshTokens(): Promise<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const url = `${this.baseUrl}/api/auth/refresh`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      this.removeToken();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
    }

    const data: LoginResponse = await response.json();
    this.setToken(data.access_token);
    if (data.refresh_token) {
      this.setRefreshToken(data.refresh_token);
    }

    return data;
  }

  /**
   * Obtener todas las estadísticas del dashboard
   */
  async getDashboardStats(period: 'month' | 'week' | 'year' = 'month'): Promise<{
    total_revenue: number;
    total_sales: number;
    total_products: number;
    low_stock_count: number;
    average_ticket: number;
    profit_margin: number;
    total_profit: number;
    revenue_change_percent: number;
    sales_change_percent: number;
    revenue_previous_period: number;
    sales_previous_period: number;
    top_products: Array<{
      product_id: number;
      product_name: string;
      total_sold: number;
      total_revenue: number;
      percentage: number;
    }>;
    top_customers: Array<{
      customer_email: string | null;
      customer_name: string | null;
      total_sales: number;
      total_revenue: number;
      percentage: number;
    }>;
    category_distribution: Array<{
      category: string;
      sales_count: number;
      revenue: number;
      percentage: number;
    }>;
    sales_by_status: {
      completed: number;
      pending: number;
      cancelled: number;
    };
    sales_timeline: Array<{
      period: string;
      sales_count: number;
      revenue: number;
    }>;
    alerts: Array<{
      type: string;
      severity: string;
      title: string;
      message: string;
      count: number;
      action_url: string | null;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append('period', period);
    return this.request(`/api/dashboard/stats?${params.toString()}`);
  }

  /**
   * Obtener top productos más vendidos
   */
  async getTopProducts(limit: number = 5): Promise<{
    products: Array<{
      product_id: number;
      product_name: string;
      total_sold: number;
      total_revenue: number;
      percentage: number;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    return this.request(`/api/dashboard/top-products?${params.toString()}`);
  }

  /**
   * Obtener top clientes más valiosos
   */
  async getTopCustomers(limit: number = 5): Promise<{
    customers: Array<{
      customer_email: string | null;
      customer_name: string | null;
      total_sales: number;
      total_revenue: number;
      percentage: number;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    return this.request(`/api/dashboard/top-customers?${params.toString()}`);
  }

  /**
   * Obtener timeline de ventas
   */
  async getSalesTimeline(period: 'monthly' | 'weekly' = 'monthly', months: number = 12): Promise<{
    timeline: Array<{
      period: string;
      sales_count: number;
      revenue: number;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append('period', period);
    params.append('months', months.toString());
    return this.request(`/api/dashboard/timeline?${params.toString()}`);
  }

  /**
   * Obtener distribución por categoría
   */
  async getCategoryDistribution(): Promise<{
    distribution: Array<{
      category: string;
      sales_count: number;
      revenue: number;
      percentage: number;
    }>;
  }> {
    return this.request('/api/dashboard/category-distribution');
  }

  /**
   * Obtener alertas del dashboard
   */
  async getDashboardAlerts(): Promise<{
    alerts: Array<{
      type: string;
      severity: string;
      title: string;
      message: string;
      count: number;
      action_url: string | null;
    }>;
  }> {
    return this.request('/api/dashboard/alerts');
  }

  // ========== FACTURAS RECURRENTES ==========

  /**
   * Obtener facturas recurrentes
   */
  async getRecurringInvoices(skip: number = 0, limit: number = 100, isActive?: boolean): Promise<RecurringInvoice[]> {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (isActive !== undefined) {
      params.append('is_active', isActive.toString());
    }
    return this.request<RecurringInvoice[]>(`/api/recurring-invoices?${params.toString()}`);
  }

  /**
   * Obtener una factura recurrente por ID
   */
  async getRecurringInvoice(id: number): Promise<RecurringInvoice> {
    return this.request<RecurringInvoice>(`/api/recurring-invoices/${id}`);
  }

  /**
   * Crear factura recurrente
   */
  async createRecurringInvoice(data: RecurringInvoiceCreate): Promise<RecurringInvoice> {
    return this.request<RecurringInvoice>('/api/recurring-invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualizar factura recurrente
   */
  async updateRecurringInvoice(id: number, data: Partial<RecurringInvoiceCreate>): Promise<RecurringInvoice> {
    return this.request<RecurringInvoice>(`/api/recurring-invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Eliminar factura recurrente
   */
  async deleteRecurringInvoice(id: number): Promise<void> {
    return this.request<void>(`/api/recurring-invoices/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Generar factura manualmente desde factura recurrente
   */
  async generateInvoiceFromRecurring(id: number, force: boolean = false): Promise<{ sale: any; next_run_date: string }> {
    return this.request(`/api/recurring-invoices/${id}/generate${force ? '?force=true' : ''}`, {
      method: 'POST',
    });
  }

  // ========== PLANTILLAS DE FACTURA ==========

  /**
   * Obtener plantillas de factura
   */
  async getInvoiceTemplates(includeSystem: boolean = true): Promise<InvoiceTemplate[]> {
    return this.request<InvoiceTemplate[]>(`/api/invoice-templates?include_system=${includeSystem}`);
  }

  /**
   * Obtener plantilla por defecto
   */
  async getDefaultInvoiceTemplate(): Promise<InvoiceTemplate> {
    return this.request<InvoiceTemplate>('/api/invoice-templates/default');
  }

  /**
   * Obtener una plantilla por ID
   */
  async getInvoiceTemplate(id: number): Promise<InvoiceTemplate> {
    return this.request<InvoiceTemplate>(`/api/invoice-templates/${id}`);
  }

  /**
   * Crear plantilla de factura
   */
  async createInvoiceTemplate(data: InvoiceTemplateCreate): Promise<InvoiceTemplate> {
    return this.request<InvoiceTemplate>('/api/invoice-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualizar plantilla de factura
   */
  async updateInvoiceTemplate(id: number, data: Partial<InvoiceTemplateCreate>): Promise<InvoiceTemplate> {
    return this.request<InvoiceTemplate>(`/api/invoice-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Eliminar plantilla de factura
   */
  async deleteInvoiceTemplate(id: number): Promise<void> {
    return this.request<void>(`/api/invoice-templates/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtener preview HTML de factura con plantilla
   */
  async getInvoicePreview(templateId: number, saleId: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/invoice-templates/${templateId}/preview/${saleId}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error obteniendo preview: ${response.statusText}`);
    }
    return response.text();
  }

  // ========== DECLARACIONES FISCALES ==========

  /**
   * Calcular Modelo 303 sin generar declaración
   */
  async calculateModel303(quarter: number, year: number, includePurchases: boolean = false): Promise<Model303CalculationResult> {
    return this.request<Model303CalculationResult>('/api/tax/model-303/calculate', {
      method: 'POST',
      body: JSON.stringify({ quarter, year, include_purchases: includePurchases }),
    });
  }

  /**
   * Generar declaración Modelo 303
   */
  async generateModel303(quarter: number, year: number, includePurchases: boolean = false, notes?: string): Promise<TaxDeclaration> {
    return this.request<TaxDeclaration>('/api/tax/model-303/generate', {
      method: 'POST',
      body: JSON.stringify({ quarter, year, include_purchases: includePurchases, notes }),
    });
  }

  /**
   * Obtener declaraciones fiscales
   */
  async getTaxDeclarations(modelType?: string): Promise<TaxDeclaration[]> {
    const params = modelType ? `?model_type=${modelType}` : '';
    return this.request<TaxDeclaration[]>(`/api/tax/declarations${params}`);
  }

  /**
   * Obtener una declaración fiscal por ID
   */
  async getTaxDeclaration(id: number): Promise<TaxDeclaration> {
    return this.request<TaxDeclaration>(`/api/tax/declarations/${id}`);
  }

  // ========== VERIFACTU ==========

  /**
   * Registrar factura en Verifactu
   */
  async registerInvoiceInVerifactu(saleId: number): Promise<any> {
    return this.request(`/api/verifactu/sales/${saleId}/register`, {
      method: 'POST',
    });
  }

  /**
   * Obtener XML Facturae de una factura registrada
   */
  /**
   * Obtener facturas (lista paginada)
   */
  async getInvoices(skip: number = 0, limit: number = 100, status?: string, hasRegistry?: boolean): Promise<{
    invoices: any[];
    total: number;
    skip: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (hasRegistry !== undefined) params.append('has_registry', hasRegistry.toString());

    const queryString = params.toString();
    return this.request<{
      invoices: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/api/invoices?${queryString}`);
  }

  /**
   * Obtener una factura por ID
   */
  async getInvoice(id: number): Promise<any> {
    return this.request<any>(`/api/invoices/${id}`);
  }

  /**
   * Crear factura desde venta
   */
  async createInvoice(saleId: number, registerInVerifactu: boolean = true): Promise<any> {
    return this.request<any>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({
        sale_id: saleId,
        register_in_verifactu: registerInVerifactu,
      }),
    });
  }

  async getVerifactuXML(saleId: number): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/verifactu/sales/${saleId}/xml`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo XML: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Obtener registro Verifactu
   */
  async getVerifactuRegistry(skip: number = 0, limit: number = 100): Promise<any[]> {
    return this.request(`/api/verifactu/registry?skip=${skip}&limit=${limit}`);
  }

  /**
   * Marcar registro como enviado a AEAT
   */
  async markVerifactuRegistryAsSent(registryId: number): Promise<any> {
    return this.request(`/api/verifactu/registry/${registryId}/mark-sent`, {
      method: 'POST',
    });
  }

  /**
   * Validar integridad de la cadena Verifactu
   */
  async validateVerifactuIntegrity(): Promise<{ is_valid: boolean; errors?: string[] }> {
    return this.request('/api/verifactu/validate-integrity', {
      method: 'POST',
    });
  }

  /**
   * Obtener certificados electrónicos
   */
  async getElectronicCertificates(): Promise<any[]> {
    return this.request('/api/verifactu/certificates');
  }

  /**
   * Subir certificado electrónico
   */
  async uploadElectronicCertificate(name: string, certificateType: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('certificate_type', certificateType);

    const response = await fetch(`${this.baseUrl}/api/verifactu/certificates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error subiendo certificado: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtener estado de integración AEAT
   */
  async getAEATIntegrationStatus(): Promise<any> {
    return this.request('/api/verifactu/aeat/status');
  }

  /**
   * Enviar todos los registros pendientes a AEAT
   */
  async sendAllPendingToAEAT(): Promise<any> {
    return this.request('/api/verifactu/aeat/send-all-pending', {
      method: 'POST',
    });
  }

  // ========== COMPRAS Y PROVEEDORES ==========

  /**
   * Obtener proveedores
   */
  async getSuppliers(skip: number = 0, limit: number = 100): Promise<any[]> {
    return this.request(`/api/purchases/suppliers?skip=${skip}&limit=${limit}`);
  }

  /**
   * Obtener un proveedor
   */
  async getSupplier(supplierId: number): Promise<any> {
    return this.request(`/api/purchases/suppliers/${supplierId}`);
  }

  /**
   * Crear proveedor
   */
  async createSupplier(supplier: any): Promise<any> {
    return this.request('/api/purchases/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  /**
   * Actualizar proveedor
   */
  async updateSupplier(supplierId: number, supplier: any): Promise<any> {
    return this.request(`/api/purchases/suppliers/${supplierId}`, {
      method: 'PUT',
      body: JSON.stringify(supplier),
    });
  }

  /**
   * Eliminar proveedor
   */
  async deleteSupplier(supplierId: number): Promise<void> {
    return this.request(`/api/purchases/suppliers/${supplierId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtener compras
   */
  async getPurchases(skip: number = 0, limit: number = 100): Promise<any[]> {
    return this.request(`/api/purchases?skip=${skip}&limit=${limit}`);
  }

  /**
   * Obtener una compra
   */
  async getPurchase(purchaseId: number): Promise<any> {
    return this.request(`/api/purchases/${purchaseId}`);
  }

  /**
   * Crear compra
   */
  async createPurchase(purchase: any): Promise<any> {
    return this.request('/api/purchases', {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
  }

  /**
   * Actualizar compra
   */
  async updatePurchase(purchaseId: number, purchase: any): Promise<any> {
    return this.request(`/api/purchases/${purchaseId}`, {
      method: 'PUT',
      body: JSON.stringify(purchase),
    });
  }

  /**
   * Eliminar compra
   */
  async deletePurchase(purchaseId: number): Promise<void> {
    return this.request(`/api/purchases/${purchaseId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Exporta una compra individual a PDF
   */
  async exportPurchasePDF(purchaseId: number): Promise<Blob> {
    const url = `${this.baseUrl}/api/purchases/${purchaseId}/export/pdf`;
    const token = this.getToken();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error al exportar PDF' }));
      throw new Error(error.detail || 'Error al exportar PDF');
    }

    return response.blob();
  }

  /**
   * Exporta lista de compras a PDF
   */
  async exportPurchasesPDF(params?: {
    skip?: number;
    limit?: number;
    supplier_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.supplier_id) queryParams.append('supplier_id', params.supplier_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `${this.baseUrl}/api/purchases/export/pdf?${queryParams.toString()}`;
    const token = this.getToken();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error al exportar PDF' }));
      throw new Error(error.detail || 'Error al exportar PDF');
    }

    return response.blob();
  }

  /**
   * Exporta lista de compras a Excel
   */
  async exportPurchasesExcel(params?: {
    skip?: number;
    limit?: number;
    supplier_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.supplier_id) queryParams.append('supplier_id', params.supplier_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const url = `${this.baseUrl}/api/purchases/export/excel?${queryParams.toString()}`;
    const token = this.getToken();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error al exportar Excel' }));
      throw new Error(error.detail || 'Error al exportar Excel');
    }

    return response.blob();
  }

  /**
   * Descargar PDF de una declaración fiscal (Modelo 303 o 111)
   */
  async downloadTaxDeclarationPDF(declarationId: number): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/tax/declarations/${declarationId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error descargando PDF: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Descargar PDF del Modelo 303 (alias para compatibilidad)
   */
  async downloadModel303PDF(declarationId: number): Promise<Blob> {
    return this.downloadTaxDeclarationPDF(declarationId);
  }

  // ========== MODELO 111 (RETENCIONES IRPF) ==========

  /**
   * Calcular Modelo 111 sin generar declaración
   */
  async calculateModel111(quarter: number, year: number, withholdings: any[]): Promise<any> {
    return this.request<any>('/api/tax/model-111/calculate', {
      method: 'POST',
      body: JSON.stringify({ quarter, year, withholdings }),
    });
  }

  /**
   * Generar declaración Modelo 111
   */
  async generateModel111(quarter: number, year: number, withholdings: any[], notes?: string): Promise<TaxDeclaration> {
    return this.request<TaxDeclaration>('/api/tax/model-111/generate', {
      method: 'POST',
      body: JSON.stringify({ quarter, year, withholdings, notes }),
    });
  }
}

// ========== TIPOS E INTERFACES ==========

export interface RecurringInvoice {
  id: number;
  name: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_run_date: string;
  day_of_month?: number;
  notes?: string;
  is_active: boolean;
  total_invoices_generated: number;
  items: RecurringInvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface RecurringInvoiceItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  description?: string;
}

export interface RecurringInvoiceCreate {
  name: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  day_of_month?: number;
  notes?: string;
  is_active?: boolean;
  items: Omit<RecurringInvoiceItem, 'id'>[];
}

export interface InvoiceTemplate {
  id: number;
  name: string;
  description?: string;
  html_template: string;
  header_color: string;
  footer_text?: string;
  logo_url?: string;
  show_tax_breakdown: boolean;
  show_payment_terms: boolean;
  show_notes: boolean;
  is_default: boolean;
  is_system: boolean;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplateCreate {
  name: string;
  description?: string;
  html_template: string;
  header_color?: string;
  footer_text?: string;
  logo_url?: string;
  show_tax_breakdown?: boolean;
  show_payment_terms?: boolean;
  show_notes?: boolean;
  is_default?: boolean;
}

// ========== TIPOS E INTERFACES - DECLARACIONES FISCALES ==========

export interface TaxDeclaration {
  id: number;
  user_id: number;
  model_type: '303' | '111' | '130' | '347';
  period_quarter?: number;
  period_year: number;
  period_start_date: string;
  period_end_date: string;
  status: 'draft' | 'calculated' | 'generated' | 'submitted' | 'accepted' | 'rejected';
  declaration_data?: any;
  submitted_at?: string;
  response_data?: any;
  reference_number?: string;
  pdf_path?: string;
  xml_path?: string;
  notes?: string;
  is_rectification?: string;
  created_at: string;
  updated_at: string;
}

export interface Model303CalculationResult {
  period: string;
  period_start: string;
  period_end: string;
  sales_base_21: number;
  sales_tax_21: number;
  sales_base_10: number;
  sales_tax_10: number;
  sales_base_4: number;
  sales_tax_4: number;
  sales_base_exempt: number;
  total_sales_base: number;
  total_sales_tax: number;
  purchases_base_21: number;
  purchases_tax_21: number;
  purchases_base_10: number;
  purchases_tax_10: number;
  purchases_base_4: number;
  purchases_tax_4: number;
  total_purchases_base: number;
  total_purchases_tax: number;
  result_to_pay: number;
  result_to_refund: number;
  sales_count: number;
  sales_details: Array<{
    sale_id: number;
    sale_number: string;
    date: string;
    subtotal: number;
    tax: number;
    total: number;
  }>;
}

// Types are already exported above as interfaces

export const apiClient = new ApiClient();

