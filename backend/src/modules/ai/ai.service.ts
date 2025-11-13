import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AIService {
  private readonly aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl =
      this.configService.get<string>('AI_SERVICE_URL') || 'http://ai-service:8000';
  }

  /**
   * Predecir demanda de un producto
   */
  async predictDemand(productId: number, days: number = 30): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/predict/demand`, {
          product_id: productId,
          days,
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI service:', (error as any).message);
      throw error;
    }
  }

  /**
   * Optimizar precio de un producto
   */
  async optimizePrice(productId: number, currentPrice: number, stock: number): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/optimize/price`, {
          product_id: productId,
          current_price: currentPrice,
          stock,
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI service:', (error as any).message);
      throw error;
    }
  }

  /**
   * Obtener modelos de IA activos
   */
  async getActiveModels(): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get(`${this.aiServiceUrl}/api/models/active`),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI service:', (error as any).message);
      // Retornar datos mock si el servicio no está disponible
      return {
        total_models: 32,
        operational: 28,
        training: 3,
        maintenance: 1,
      };
    }
  }

  /**
   * Obtener estadísticas de modelos
   */
  async getModelStats(): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get(`${this.aiServiceUrl}/api/models/stats`),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI service:', (error as any).message);
      // Mock de métricas con series temporales
      const now = Date.now();
      const points = Array.from({ length: 12 }).map((_, i) => ({
        ts: new Date(now - (11 - i) * 3600_000).toISOString(),
        accuracy: 0.82 + Math.sin(i / 3) * 0.05,
        latencyMsP95: 180 + (i % 3) * 10,
        latencyMsP99: 220 + (i % 4) * 12,
        throughputRps: 35 + i,
        errorRate: 0.005 + (i % 2) * 0.001,
      }));
      return {
        overall: {
          throughputRps: 48,
          latencyMsP95: 190,
          latencyMsP99: 235,
          errorRate: 0.006,
        },
        series: points,
        recent: {
          predictions: [
            {
              id: 'pd-001',
              productId: 1,
              units: 150,
              confidence: 0.85,
              ts: new Date(now - 600_000).toISOString(),
            },
            {
              id: 'pd-002',
              productId: 2,
              units: 78,
              confidence: 0.81,
              ts: new Date(now - 1_800_000).toISOString(),
            },
          ],
          optimizations: [
            {
              id: 'op-001',
              productId: 1,
              optimalPrice: 315.5,
              deltaPct: 5.2,
              ts: new Date(now - 900_000).toISOString(),
            },
          ],
        },
      };
    }
  }

  /** Obtener métricas agregadas (alias a getModelStats) */
  async getMetrics(): Promise<any> {
    // Leer últimas 200 muestras persistidas si existen
    try {
      // Carga perezosa de Prisma para evitar dependencia circular
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const rows = await prisma.aIMetric.findMany({
        orderBy: { ts: 'asc' },
        take: 200,
      });
      const overall = rows.length
        ? {
            throughputRps: rows[rows.length - 1].throughputRps ?? 0,
            latencyMsP95: rows[rows.length - 1].latencyMsP95 ?? 0,
            latencyMsP99: rows[rows.length - 1].latencyMsP99 ?? 0,
            errorRate: rows[rows.length - 1].errorRate ?? 0,
          }
        : { throughputRps: 0, latencyMsP95: 0, latencyMsP99: 0, errorRate: 0 };
      return {
        overall,
        series: rows.map((r: any) => ({
          ts: r.ts.toISOString(),
          accuracy: r.accuracy ?? 0,
          latencyMsP95: r.latencyMsP95 ?? 0,
          latencyMsP99: r.latencyMsP99 ?? 0,
          throughputRps: r.throughputRps ?? 0,
          errorRate: r.errorRate ?? 0,
        })),
        recent: {
          predictions: [],
          optimizations: [],
        },
      };
    } catch {
      return this.getModelStats();
    }
  }
}
