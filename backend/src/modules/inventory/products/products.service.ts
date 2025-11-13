import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductInput: CreateProductInput) {
    return this.prisma.product.create({
      data: {
        ...createProductInput,
        price: Number(createProductInput.price),
        cost: createProductInput.cost ? Number(createProductInput.cost) : undefined,
      },
    });
  }

  async findAll(skip = 0, take = 10, search?: string, category?: string) {
    const where: Prisma.ProductWhereInput = {
      AND: [
        { isActive: true },
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { category: { equals: category } } : {},
      ],
    };

    return this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductInput,
        price: updateProductInput.price ? Number(updateProductInput.price) : undefined,
        cost: updateProductInput.cost ? Number(updateProductInput.cost) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(id: number, quantity: number, operation: 'ADD' | 'SUBTRACT') {
    const product = await this.findOne(id);

    const newStock = operation === 'ADD' ? product.stock + quantity : product.stock - quantity;

    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: { stock: 'asc' },
    });
  }
}
