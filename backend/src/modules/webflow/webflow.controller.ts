import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WebflowService } from './webflow.service';
import { WebflowOrderInput, WebflowOrderResponse } from './dto/webflow.dto';

@Controller('webflow')
export class WebflowController {
  constructor(private readonly webflowService: WebflowService) {}

  /**
   * Webhook: Recibir órdenes desde Webflow
   */
  @Post('webhook/order')
  async handleWebflowWebhook(@Body() payload: any): Promise<{ success: boolean; message: string }> {
    try {
      // Procesar webhook según el tipo de evento
      console.log('Webhook recibido de Webflow:', payload);

      // TODO: Implementar lógica específica según el tipo de webhook
      // payload.type puede ser: 'order.created', 'order.updated', etc.

      return {
        success: true,
        message: 'Webhook procesado correctamente',
      };
    } catch (error) {
      console.error('Error procesando webhook de Webflow:', error);
      return {
        success: false,
        message: 'Error procesando webhook',
      };
    }
  }

  /**
   * REST endpoint: Crear orden
   */
  @Post('order')
  async createOrder(@Body() orderInput: WebflowOrderInput): Promise<WebflowOrderResponse> {
    return this.webflowService.createOrderFromWebflow(orderInput);
  }

  /**
   * REST endpoint: Obtener productos
   */
  @Get('products')
  async getProducts(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.webflowService.getPublicProducts(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 100,
    );
  }

  /**
   * REST endpoint: Verificar stock
   */
  @Post('validate-cart')
  async validateCart(@Body() items: Array<{ sku: string; quantity: number }>) {
    return this.webflowService.validateCartItems(items);
  }

  /**
   * REST endpoint: Estado de orden
   */
  @Get('order/:orderNumber/status')
  async getOrderStatus(@Param('orderNumber') orderNumber: string) {
    return this.webflowService.getOrderStatus(orderNumber);
  }
}
