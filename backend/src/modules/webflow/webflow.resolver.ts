import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WebflowService } from './webflow.service';
import { WebflowOrderInput, WebflowOrderResponse, WebflowPublicProduct } from './dto/webflow.dto';

@Resolver()
export class WebflowResolver {
  constructor(private readonly webflowService: WebflowService) {}

  /**
   * Obtener productos públicos para Webflow
   */
  @Query(() => [WebflowPublicProduct], { name: 'webflowProducts' })
  async getWebflowProducts(
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 100 }) take: number,
  ): Promise<WebflowPublicProduct[]> {
    return this.webflowService.getPublicProducts(skip, take);
  }

  /**
   * Obtener producto por SKU
   */
  @Query(() => WebflowPublicProduct, { name: 'webflowProductBySku' })
  async getWebflowProductBySku(@Args('sku') sku: string): Promise<WebflowPublicProduct | null> {
    return this.webflowService.getProductBySku(sku);
  }

  /**
   * Crear orden desde Webflow
   */
  @Mutation(() => WebflowOrderResponse, { name: 'createWebflowOrder' })
  async createWebflowOrder(@Args('order') order: WebflowOrderInput): Promise<WebflowOrderResponse> {
    return this.webflowService.createOrderFromWebflow(order);
  }

  /**
   * Obtener estado de una orden
   */
  @Query(() => WebflowOrderResponse, { name: 'webflowOrderStatus' })
  async getWebflowOrderStatus(
    @Args('orderNumber') orderNumber: string,
  ): Promise<WebflowOrderResponse> {
    const status = await this.webflowService.getOrderStatus(orderNumber);
    return {
      orderNumber: status.orderNumber,
      status: status.status,
      totalAmount: status.totalAmount,
      estimatedDelivery: new Date(),
    };
  }
}
