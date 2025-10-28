import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AccountingService {
    constructor(private readonly prisma: PrismaService) { }

    async getFinancialSummary(startDate?: Date, endDate?: Date) {
        const where: any = {};

        if (startDate && endDate) {
            where.orderDate = {
                gte: startDate,
                lte: endDate,
            };
        }

        // Ventas totales
        const salesData = await this.prisma.salesOrder.aggregate({
            where: {
                ...where,
                status: { not: 'CANCELLED' },
            },
            _sum: { totalAmount: true },
            _count: true,
        });

        // Compras totales
        const purchasesData = await this.prisma.purchaseOrder.aggregate({
            where: {
                ...where,
                status: { not: 'CANCELLED' },
            },
            _sum: { totalAmount: true },
        });

        // Órdenes pendientes
        const pendingOrders = await this.prisma.salesOrder.count({
            where: { status: 'PENDING' },
        });

        const totalSales = Number(salesData._sum.totalAmount) || 0;
        const totalPurchases = Number(purchasesData._sum.totalAmount) || 0;
        const netProfit = totalSales - totalPurchases;
        const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

        return {
            totalSales,
            totalPurchases,
            netProfit,
            profitMargin,
            totalOrders: salesData._count,
            pendingOrders,
        };
    }

    async getMonthlySales(year: number) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const orders = await this.prisma.salesOrder.findMany({
            where: {
                orderDate: {
                    gte: startDate,
                    lte: endDate,
                },
                status: { not: 'CANCELLED' },
            },
            select: {
                orderDate: true,
                totalAmount: true,
            },
        });

        // Agrupar por mes
        const monthlyData: Record<number, { total: number; count: number }> = {};

        for (let i = 0; i < 12; i++) {
            monthlyData[i] = { total: 0, count: 0 };
        }

        orders.forEach(order => {
            const month = order.orderDate.getMonth();
            monthlyData[month].total += Number(order.totalAmount);
            monthlyData[month].count += 1;
        });

        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        return months.map((month, index) => ({
            month,
            total: monthlyData[index].total,
            orderCount: monthlyData[index].count,
        }));
    }

    async getTopProducts(limit = 10) {
        const items = await this.prisma.salesOrderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                totalPrice: true,
            },
            orderBy: {
                _sum: {
                    totalPrice: 'desc',
                },
            },
            take: limit,
        });

        const productsWithDetails = await Promise.all(
            items.map(async (item) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true },
                });

                return {
                    productId: item.productId,
                    productName: product?.name || 'Producto desconocido',
                    totalQuantity: item._sum.quantity || 0,
                    totalRevenue: Number(item._sum.totalPrice) || 0,
                };
            })
        );

        return productsWithDetails;
    }

    async getInventoryValue() {
        const products = await this.prisma.product.findMany({
            select: {
                stock: true,
                cost: true,
                minStock: true,
            },
        });

        let totalValue = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;

        products.forEach(product => {
            const cost = Number(product.cost) || 0;
            totalValue += product.stock * cost;

            if (product.stock === 0) {
                outOfStockCount++;
            } else if (product.stock <= product.minStock) {
                lowStockCount++;
            }
        });

        return {
            totalValue,
            totalProducts: products.length,
            lowStockProducts: lowStockCount,
            outOfStockProducts: outOfStockCount,
        };
    }
}
