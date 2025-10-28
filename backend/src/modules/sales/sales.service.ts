import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
    CreateSalesOrderInput,
    UpdateSalesOrderInput,
    CreateCustomerInput,
    UpdateCustomerInput,
} from './dto/sales.input';
import {
    CreateSalesInvoiceInput,
    UpdateSalesInvoiceInput,
    RecordPaymentInput,
} from './dto/sales-invoice.input';

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) { }

    // ============ SALES ORDERS ============

    async createSalesOrder(data: CreateSalesOrderInput, userId: number) {
        // Generar número de orden único
        const orderNumber = `SO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

        // Calcular totales
        const subtotal = data.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );
        const taxAmount = subtotal * 0.16; // 16% IVA
        const totalAmount = subtotal + taxAmount;

        return this.prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId: data.customerId,
                userId,
                status: 'PENDING',
                subtotal,
                taxAmount,
                totalAmount,
                notes: data.notes,
                deliveryDate: data.deliveryDate,
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
                customer: true,
                user: true,
            },
        });
    }

    async findAllSalesOrders(skip = 0, take = 10, status?: string) {
        const where = status ? { status: status as any } : {};

        return this.prisma.salesOrder.findMany({
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
                customer: true,
                user: true,
            },
        });
    }

    async findOneSalesOrder(id: number) {
        const order = await this.prisma.salesOrder.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                user: true,
            },
        });

        if (!order) {
            throw new NotFoundException(`Orden de venta #${id} no encontrada`);
        }

        return order;
    }

    async updateSalesOrder(data: UpdateSalesOrderInput) {
        const order = await this.findOneSalesOrder(data.id);

        return this.prisma.salesOrder.update({
            where: { id: data.id },
            data: {
                status: data.status,
                notes: data.notes,
                deliveryDate: data.deliveryDate,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                user: true,
            },
        });
    }

    async cancelSalesOrder(id: number) {
        const order = await this.findOneSalesOrder(id);

        return this.prisma.salesOrder.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                user: true,
            },
        });
    }

    // ============ SALES INVOICES ============

    async createSalesInvoice(data: CreateSalesInvoiceInput, userId: number) {
        // Generar número de factura único
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

        // Si viene de una orden de venta, cargar los datos
        let salesOrder = null;
        if (data.salesOrderId) {
            salesOrder = await this.findOneSalesOrder(data.salesOrderId);
        }

        // Calcular totales
        const items = data.items || (salesOrder ? salesOrder.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: 0,
            taxRate: 0,
        })) : []);

        const subtotal = items.reduce((sum: number, item: any) => {
            const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
            return sum + itemTotal;
        }, 0);

        const taxRate = 0.16; // 16% IVA por defecto
        const taxAmount = subtotal * taxRate;
        const discountAmount = data.discountAmount || 0;
        const total = subtotal + taxAmount - discountAmount;

        return this.prisma.salesInvoice.create({
            data: {
                invoiceNumber,
                customerId: data.customerId || (salesOrder?.customerId ?? 0),
                salesOrderId: data.salesOrderId,
                invoiceDate: data.invoiceDate || new Date(),
                dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
                status: 'DRAFT',
                paymentStatus: 'UNPAID',
                subtotal,
                taxRate,
                taxAmount,
                discountAmount,
                total,
                paidAmount: 0,
                outstandingAmount: total,
                currency: data.currency || 'USD',
                paymentTerms: data.paymentTerms,
                notes: data.notes,
                termsAndConditions: data.termsAndConditions,
                createdBy: userId,
                items: {
                    create: items.map((item: any) => {
                        const itemTaxAmount = (item.quantity * item.unitPrice - (item.discount || 0)) * (item.taxRate || taxRate);
                        const itemTotal = item.quantity * item.unitPrice - (item.discount || 0) + itemTaxAmount;

                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount || 0,
                            taxRate: item.taxRate || taxRate,
                            taxAmount: itemTaxAmount,
                            totalAmount: itemTotal,
                            description: item.description,
                        };
                    }),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                salesOrder: true,
                user: true,
            },
        });
    }

    async findAllSalesInvoices(skip = 0, take = 10, status?: string, paymentStatus?: string) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (paymentStatus) {
            where.paymentStatus = paymentStatus;
        }

        return this.prisma.salesInvoice.findMany({
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
                customer: true,
                salesOrder: true,
                user: true,
                payments: true,
            },
        });
    }

    async findOneSalesInvoice(id: number) {
        const invoice = await this.prisma.salesInvoice.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                salesOrder: true,
                user: true,
                payments: true,
            },
        });

        if (!invoice) {
            throw new NotFoundException(`Factura #${id} no encontrada`);
        }

        return invoice;
    }

    async updateSalesInvoice(id: number, data: UpdateSalesInvoiceInput) {
        const invoice = await this.findOneSalesInvoice(id);

        if (invoice.status !== 'DRAFT') {
            throw new Error('Solo las facturas en borrador pueden ser editadas');
        }

        // Si hay items, recalcular totales
        let updateData: any = {
            customerId: data.customerId,
            invoiceDate: data.invoiceDate,
            dueDate: data.dueDate,
            currency: data.currency,
            paymentTerms: data.paymentTerms,
            notes: data.notes,
            termsAndConditions: data.termsAndConditions,
        };

        if (data.items && data.items.length > 0) {
            // Eliminar items existentes
            await this.prisma.salesInvoiceItem.deleteMany({
                where: { invoiceId: id },
            });

            const taxRate = 0.16;
            const subtotal = data.items.reduce((sum, item) => {
                const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
                return sum + itemTotal;
            }, 0);

            const taxAmount = subtotal * taxRate;
            const discountAmount = data.discountAmount || 0;
            const total = subtotal + taxAmount - discountAmount;

            updateData = {
                ...updateData,
                subtotal,
                taxAmount,
                discountAmount,
                total,
                outstandingAmount: total,
                items: {
                    create: data.items.map((item) => {
                        const itemTaxAmount = (item.quantity * item.unitPrice - (item.discount || 0)) * (item.taxRate || taxRate);
                        const itemTotal = item.quantity * item.unitPrice - (item.discount || 0) + itemTaxAmount;

                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount || 0,
                            taxRate: item.taxRate || taxRate,
                            taxAmount: itemTaxAmount,
                            totalAmount: itemTotal,
                            description: item.description,
                        };
                    }),
                },
            };
        }

        return this.prisma.salesInvoice.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                salesOrder: true,
                user: true,
                payments: true,
            },
        });
    }

    async submitSalesInvoice(id: number) {
        const invoice = await this.findOneSalesInvoice(id);

        if (invoice.status !== 'DRAFT') {
            throw new Error('Solo las facturas en borrador pueden ser enviadas');
        }

        return this.prisma.salesInvoice.update({
            where: { id },
            data: { status: 'SUBMITTED' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                salesOrder: true,
                user: true,
                payments: true,
            },
        });
    }

    async createInvoicePayment(invoiceId: number, data: RecordPaymentInput, userId: number) {
        const invoice = await this.findOneSalesInvoice(invoiceId);

        // Validar que el monto no exceda el saldo pendiente
        const outstandingAmount = parseFloat(invoice.outstandingAmount.toString());
        if (data.amount > outstandingAmount) {
            throw new Error(`El monto del pago ($${data.amount}) excede el saldo pendiente ($${outstandingAmount})`);
        }

        // Crear el pago
        const payment = await this.prisma.invoicePayment.create({
            data: {
                invoiceId,
                amount: data.amount,
                paymentDate: data.paymentDate || new Date(),
                paymentMethod: data.paymentMethod || 'CASH',
                reference: data.reference,
                notes: data.notes,
                createdBy: userId,
            },
        });

        // Actualizar el monto pagado y pendiente de la factura
        const currentPaidAmount = parseFloat(invoice.paidAmount.toString());
        const newPaidAmount = currentPaidAmount + data.amount;
        const newOutstandingAmount = parseFloat(invoice.total.toString()) - newPaidAmount;

        let paymentStatus = invoice.paymentStatus;
        if (newOutstandingAmount === 0) {
            paymentStatus = 'PAID';
        } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
        }

        await this.prisma.salesInvoice.update({
            where: { id: invoiceId },
            data: {
                paidAmount: newPaidAmount,
                outstandingAmount: newOutstandingAmount,
                paymentStatus,
                paidAt: paymentStatus === 'PAID' ? new Date() : null,
            },
        });

        return payment;
    }

    async cancelSalesInvoice(id: number) {
        const invoice = await this.findOneSalesInvoice(id);

        if (invoice.paymentStatus === 'PAID' || invoice.paymentStatus === 'PARTIALLY_PAID') {
            throw new Error('No se puede cancelar una factura que ya tiene pagos');
        }

        return this.prisma.salesInvoice.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                salesOrder: true,
                user: true,
                payments: true,
            },
        });
    }

    async getInvoicePayments(invoiceId: number) {
        await this.findOneSalesInvoice(invoiceId);

        return this.prisma.invoicePayment.findMany({
            where: { invoiceId },
            orderBy: { paymentDate: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async deleteInvoicePayment(paymentId: number, userId: number) {
        const payment = await this.prisma.invoicePayment.findUnique({
            where: { id: paymentId },
            include: { invoice: true },
        });

        if (!payment) {
            throw new NotFoundException(`Pago #${paymentId} no encontrado`);
        }

        const invoice = payment.invoice;

        // Eliminar el pago
        await this.prisma.invoicePayment.delete({
            where: { id: paymentId },
        });

        // Recalcular totales de la factura
        const currentPaidAmount = parseFloat(invoice.paidAmount.toString());
        const paymentAmount = parseFloat(payment.amount.toString());
        const newPaidAmount = currentPaidAmount - paymentAmount;
        const newOutstandingAmount = parseFloat(invoice.total.toString()) - newPaidAmount;

        let paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' = 'UNPAID';
        if (newOutstandingAmount === 0) {
            paymentStatus = 'PAID';
        } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
        }

        await this.prisma.salesInvoice.update({
            where: { id: invoice.id },
            data: {
                paidAmount: newPaidAmount,
                outstandingAmount: newOutstandingAmount,
                paymentStatus,
                paidAt: paymentStatus === 'PAID' ? new Date() : null,
            },
        });

        return { success: true, message: 'Pago eliminado correctamente' };
    }

    // ============ CUSTOMERS ============

    async createCustomer(data: CreateCustomerInput) {
        return this.prisma.customer.create({
            data,
        });
    }

    async findAllCustomers(skip = 0, take = 10, search?: string) {
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as any } },
                    { email: { contains: search, mode: 'insensitive' as any } },
                ],
            }
            : {};

        return this.prisma.customer.findMany({
            where,
            skip,
            take,
            orderBy: { name: 'asc' },
        });
    }

    async findOneCustomer(id: number) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                salesOrders: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });

        if (!customer) {
            throw new NotFoundException(`Cliente #${id} no encontrado`);
        }

        return customer;
    }

    async updateCustomer(data: UpdateCustomerInput) {
        await this.findOneCustomer(data.id);

        return this.prisma.customer.update({
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

    async removeCustomer(id: number) {
        await this.findOneCustomer(id);

        return this.prisma.customer.delete({
            where: { id },
        });
    }

    // ============ STATISTICS ============

    async getSalesStatistics(startDate?: Date, endDate?: Date) {
        const where: any = {};

        if (startDate && endDate) {
            where.orderDate = {
                gte: startDate,
                lte: endDate,
            };
        }

        const [totalSales, totalOrders, averageOrderValue] = await Promise.all([
            this.prisma.salesOrder.aggregate({
                where,
                _sum: { totalAmount: true },
            }),
            this.prisma.salesOrder.count({ where }),
            this.prisma.salesOrder.aggregate({
                where,
                _avg: { totalAmount: true },
            }),
        ]);

        return {
            totalSales: totalSales._sum.totalAmount || 0,
            totalOrders,
            averageOrderValue: averageOrderValue._avg.totalAmount || 0,
        };
    }
}
