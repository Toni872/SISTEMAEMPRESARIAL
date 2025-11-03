import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AIService } from './ai.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveAIModels, OptimizePriceResult, PredictDemandResult, AIMetrics, DeployModelResult } from './ai.types';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AIResolver {
  constructor(private readonly aiService: AIService) {}

  @Query(() => String, { name: 'aiHealth' })
  async getHealth(): Promise<string> {
    return 'AI Service is active';
  }

  @Query(() => ActiveAIModels, { name: 'activeAIModels' })
  async getActiveModels() {
    return this.aiService.getActiveModels();
  }

  @Query(() => ActiveAIModels, { name: 'aiModelStats' })
  async getModelStats() {
    return this.aiService.getModelStats();
  }

  @Query(() => AIMetrics, { name: 'aiMetrics' })
  async getAIMetrics() {
    return this.aiService.getMetrics();
  }

  @Query(() => PredictDemandResult, { name: 'predictDemand' })
  async predictDemand(
    @Args('productId', { type: () => Number }) productId: number,
    @Args('days', { type: () => Number, defaultValue: 30 }) days: number,
  ) {
    return this.aiService.predictDemand(productId, days);
  }

  @Query(() => OptimizePriceResult, { name: 'optimizePrice' })
  async optimizePrice(
    @Args('productId', { type: () => Number }) productId: number,
    @Args('currentPrice', { type: () => Number }) currentPrice: number,
    @Args('stock', { type: () => Number }) stock: number,
  ) {
    return this.aiService.optimizePrice(productId, currentPrice, stock);
  }

  @Mutation(() => DeployModelResult, { name: 'deployAIModel' })
  async deployAIModel(
    @Args('name') name: string,
    @Args('version') version: string,
  ): Promise<DeployModelResult> {
    // Mock de despliegue inmediato satisfactorio
    return {
      success: true,
      message: `Modelo ${name} (${version}) desplegado correctamente`,
    };
  }
}



