import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { 
    WebflowOrderInput, 
    WebflowOrderResponse,
    WebflowPublicProduct 
} from './dto/webflow.dto';

@Injectable()
export class WebflowService {
    constructor(private prisma: PrismaService) {}

    /**
     * Obtener productos públicos para Webflow (sin información sensible)
     */
    async getPublicProducts(skip: number = 0, take: number = 100): Promise<WebflowPublicProduct[]> {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                productType: 'PHYSICAL', // Solo productos físicos para web
            },
            skip,
            take,
            select: {
                id: true,
                name: true,
                description: true,
                sku: true,
                price: true,
                stock: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            sku: product.sku,
            price: Number(product.price),
            stock: product.stock,
            category: product.category || '',
            image: undefined, // TODO: agregar campo de imagen
        }));
    }

    /**
     * Obtener un producto por SKU (público)
     */
    async getProductBySku(sku: string): Promise<WebflowPublicProduct | null> {
        const product = await this.prisma.product.findUnique({
            where: { sku },
            select: {
                id: true,
                name: true,
                description: true,
                sku: true,
                price: true,
                stock: true,
                category: true,
                isActive: true,
            },
        });

        if (!product || !product.isActive) {
            return null;
        }

        return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            sku: product.sku,
            price: Number(product.price),
            stock: product.stock,
            category: product.category || '',
            image: undefined,
        };
    }

    /**
     * Verificar disponibilidad de productos en el carrito
     */
    async validateCartItems(items: Array<{ sku: string; quantity: number }>): Promise<{
        valid: boolean;
        errors: Array<{ sku: string; message: string }>;
    }> {
        const errors: Array<{ sku: string; message: string }> = [];

        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { sku: item.sku },
                select: {
                    stock: true,
                    isActive: true,
                    name: true,
                },
            });

            if (!product) {
                errors.push({
                    sku: item.sku,
                    message: 'Producto no encontrado',
                });
                continue;
            }

            if (!product.isActive) {
                errors.push({
                    sku: item.sku,
                    message: 'Producto no disponible',
                });
                continue;
            }

            if (product.stock < item.quantity) {
                errors.push({
                    sku: item.sku,
                    message: `Solo hay ${product.stock} unidades disponibles`,
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Crear orden desde Webflow
     */
    async createOrderFromWebflow(orderInput: WebflowOrderInput): Promise<WebflowOrderResponse> {
        // Validar items del carrito
        const validation = await this.validateCartItems(
            orderInput.items.map(item => ({
                sku: item.sku,
                quantity: item.quantity,
            }))
        );

        if (!validation.valid) {
            throw new BadRequestException(`Errores en el carrito: ${validation.errors.map(e => e.message).join(', ')}`);
        }

        // Buscar o crear cliente
        const customer = await this.prisma.customer.upsert({
            where: { email: orderInput.customer.email },
            update: {
                name: orderInput.customer.company || 
                      `${orderInput.customer.firstName || ''} ${orderInput.customer.lastName || ''}`.trim() ||
                      orderInput.customer.email,
                phone: orderInput.customer.phone,
                taxId: orderInput.customer.taxId,
            },
            create: {
                email: orderInput.customer.email,
                name: orderInput.customer.company || 
                      `${orderInput.customer.firstName || ''} ${orderInput.customer.lastName || ''}`.trim() ||
                      orderInput.customer.email,
                phone: orderInput.customer.phone,
                taxId: orderInput.customer.taxId,
                isActive: true,
            },
        });

        // Crear orden de venta
        const orderNumber = `WF-${Date.now()}`;
        const salesOrder = await this.prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId: customer.id,
                userId: 1, // TODO: asignar a usuario del sistema
                status: 'CONFIRMED',
                subtotal: orderInput.subtotal,
                taxAmount: orderInput.taxAmount || 0,
                discountAmount: orderInput.discountAmount || 0,
                totalAmount: orderInput.totalAmount,
                notes: orderInput.notes || `Orden desde Webflow - ${orderInput.webflowOrderId || 'N/A'}`,
                items: {
                    create: orderInput.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        discount: 0,
                    })),
                },
            },
        });

        // Descontar stock
        for (const item of orderInput.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });

            // Registrar movimiento de stock
            await this.prisma.stockMovement.create({
                data: {
                    productId: item.productId,
                    movementType: 'OUT',
                    quantity: -item.quantity,
                    reference: orderNumber,
                    reason: 'Venta desde Webflow',
                },
            });
        }

        // Calcular fecha estimada de entrega (5 días hábiles)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        return {
            orderNumber: salesOrder.orderNumber,
            status: salesOrder.status,
            totalAmount: Number(salesOrder.totalAmount),
            estimatedDelivery,
            message: 'Orden creada exitosamente',
        };
    }

    /**
     * Obtener estado de una orden
     */
    async getOrderStatus(orderNumber: string): Promise<{
        orderNumber: string;
        status: string;
        totalAmount: number;
        createdAt: Date;
        shippingAddress?: string;
    }> {
        const order = await this.prisma.salesOrder.findUnique({
            where: { orderNumber },
            include: {
                customer: {
                    select: {
                        address: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException(`Orden ${orderNumber} no encontrada`);
        }

        return {
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt,
            shippingAddress: order.customer.address || undefined,
        };
    }
}

