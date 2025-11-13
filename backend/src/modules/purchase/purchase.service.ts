import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  CreateSupplierInput,
  UpdateSupplierInput,
} from './dto/purchase.input';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  // ============ PURCHASE ORDERS ============

  async createPurchaseOrder(data: CreatePurchaseOrderInput, userId: number) {
    // Generar número de orden único
    const orderNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * 0.16; // 16% IVA
    const totalAmount = subtotal + taxAmount;

    return this.prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId: data.supplierId,
        userId,
        status: 'PENDING',
        subtotal,
        taxAmount,
        totalAmount,
        notes: data.notes,
        expectedDate: data.expectedDeliveryDate,
        orderDate: new Date(),
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });
  }

  async findAllPurchaseOrders(skip = 0, take = 10, status?: string) {
    const where = status ? { status: status as any } : {};

    return this.prisma.purchaseOrder.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });
  }

  async findOnePurchaseOrder(id: number) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden de compra #${id} no encontrada`);
    }

    return order;
  }

  async updatePurchaseOrder(data: UpdatePurchaseOrderInput) {
    await this.findOnePurchaseOrder(data.id);

    return this.prisma.purchaseOrder.update({
      where: { id: data.id },
      data: {
        status: data.status as any,
        notes: data.notes,
        expectedDate: data.expectedDeliveryDate,
        receivedDate: data.receivedDate,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });
  }

  async receivePurchaseOrder(id: number) {
    const order = await this.findOnePurchaseOrder(id);

    // Actualizar stock de productos
    for (const item of order.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      // Registrar movimiento de stock
      await this.prisma.stockMovement.create({
        data: {
          productId: item.productId,
          movementType: 'IN',
          quantity: item.quantity,
          reference: `PO-${order.orderNumber}`,
          reason: `Recepción de orden de compra #${order.id}`,
        },
      });
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'RECEIVED' as any,
        receivedDate: new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });
  }

  async cancelPurchaseOrder(id: number) {
    await this.findOnePurchaseOrder(id);

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: true,
      },
    });
  }

  // ============ SUPPLIERS ============

  async createSupplier(data: CreateSupplierInput) {
    return this.prisma.supplier.create({
      data,
    });
  }

  async findAllSuppliers(skip = 0, take = 10, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { email: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    return this.prisma.supplier.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findOneSupplier(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Proveedor #${id} no encontrado`);
    }

    return supplier;
  }

  async updateSupplier(data: UpdateSupplierInput) {
    await this.findOneSupplier(data.id);

    return this.prisma.supplier.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      },
    });
  }

  async removeSupplier(id: number) {
    await this.findOneSupplier(id);

    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
