import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed de datos...')

    // Create users with different roles
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@erp.com' },
        update: {},
        create: {
            email: 'admin@erp.com',
            password: hashedPassword,
            firstName: 'Sistema',
            lastName: 'Administrador',
            role: 'ADMIN',
            isActive: true,
        },
    })
    console.log('✅ Usuario ADMIN creado:', adminUser.email)

    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@erp.com' },
        update: {},
        create: {
            email: 'manager@erp.com',
            password: hashedPassword,
            firstName: 'Gerente',
            lastName: 'General',
            role: 'MANAGER',
            isActive: true,
        },
    })
    console.log('✅ Usuario MANAGER creado:', managerUser.email)

    const regularUser = await prisma.user.upsert({
        where: { email: 'user@erp.com' },
        update: {},
        create: {
            email: 'user@erp.com',
            password: hashedPassword,
            firstName: 'Usuario',
            lastName: 'Regular',
            role: 'USER',
            isActive: true,
        },
    })
    console.log('✅ Usuario USER creado:', regularUser.email)

    const readonlyUser = await prisma.user.upsert({
        where: { email: 'readonly@erp.com' },
        update: {},
        create: {
            email: 'readonly@erp.com',
            password: hashedPassword,
            firstName: 'Usuario',
            lastName: 'Solo Lectura',
            role: 'READONLY',
            isActive: true,
        },
    })
    console.log('✅ Usuario READONLY creado:', readonlyUser.email)

    // Create sample customers
    const customers = await Promise.all([
        prisma.customer.create({
            data: {
                name: 'Empresa ABC S.A.',
                email: 'contacto@empresaabc.com',
                phone: '+1234567890',
                address: 'Calle Principal 123',
                city: 'Ciudad Principal',
                postalCode: '12345',
                country: 'País Ejemplo',
                taxId: 'ABC123456789',
                creditLimit: 50000,
                paymentTerms: 30,
            },
        }),
        prisma.customer.create({
            data: {
                name: 'Comercial XYZ Ltda.',
                email: 'ventas@comercialxyz.com',
                phone: '+1234567891',
                address: 'Avenida Secundaria 456',
                city: 'Ciudad Secundaria',
                postalCode: '67890',
                country: 'País Ejemplo',
                taxId: 'XYZ987654321',
                creditLimit: 25000,
                paymentTerms: 15,
            },
        }),
    ])

    console.log('✅ Clientes creados:', customers.length)

    // Create sample suppliers
    const suppliers = await Promise.all([
        prisma.supplier.create({
            data: {
                name: 'Proveedor Global S.A.',
                email: 'compras@proveedorglobal.com',
                phone: '+1234567892',
                address: 'Industrial Park 789',
                city: 'Ciudad Industrial',
                postalCode: '11111',
                country: 'País Proveedor',
                taxId: 'PG111222333',
                paymentTerms: 30,
            },
        }),
        prisma.supplier.create({
            data: {
                name: 'Suministros Locales',
                email: 'info@suministroslocales.com',
                phone: '+1234567893',
                address: 'Local Street 321',
                city: 'Ciudad Local',
                postalCode: '22222',
                country: 'País Local',
                taxId: 'SL444555666',
                paymentTerms: 15,
            },
        }),
    ])

    console.log('✅ Proveedores creados:', suppliers.length)

    // Create sample products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'ERP Empresarial Pro',
                description: 'Sistema ERP completo para empresas medianas y grandes',
                sku: 'ERP-PRO-001',
                price: 2500.00,
                cost: 500.00,
                stock: 0, // Software no tiene stock físico
                minStock: 0,
                maxStock: null,
                category: 'Software Empresarial',
                productType: 'SOFTWARE',
                version: '2.1.0',
                platform: 'Windows, Mac, Linux',
                systemRequirements: 'Windows 10+, macOS 10.15+, Ubuntu 18.04+',
                downloadUrl: 'https://downloads.empresa.com/erp-pro-2.1.0.zip',
                fileSize: '450 MB',
                licenseType: 'CONCURRENT_USERS',
                supportIncluded: true,
                supportDuration: 12,
                documentation: 'https://docs.empresa.com/erp-pro',
            },
        }),
        prisma.product.create({
            data: {
                name: 'CRM Avanzado',
                description: 'Sistema CRM con IA para gestión de clientes',
                sku: 'CRM-ADV-002',
                price: 1200.00,
                cost: 200.00,
                stock: 0,
                minStock: 0,
                maxStock: null,
                category: 'Software Empresarial',
                productType: 'SOFTWARE',
                version: '1.8.2',
                platform: 'Web, Mobile',
                systemRequirements: 'Navegador moderno, iOS 12+, Android 8+',
                downloadUrl: 'https://downloads.empresa.com/crm-adv-1.8.2.zip',
                fileSize: '120 MB',
                licenseType: 'NAMED_USERS',
                supportIncluded: true,
                supportDuration: 6,
                documentation: 'https://docs.empresa.com/crm-advanced',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Sistema de Contabilidad',
                description: 'Software contable con módulos fiscales completos',
                sku: 'ACC-SYS-003',
                price: 800.00,
                cost: 150.00,
                stock: 0,
                minStock: 0,
                maxStock: null,
                category: 'Software Empresarial',
                productType: 'SOFTWARE',
                version: '3.0.1',
                platform: 'Windows',
                systemRequirements: 'Windows 10+, SQL Server 2016+',
                downloadUrl: 'https://downloads.empresa.com/accounting-3.0.1.zip',
                fileSize: '280 MB',
                licenseType: 'SITE_LICENSE',
                supportIncluded: true,
                supportDuration: 12,
                documentation: 'https://docs.empresa.com/accounting-system',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Laptop Empresarial',
                description: 'Laptop para uso empresarial con alta performance',
                sku: 'LAP-ENT-004',
                price: 1200.00,
                cost: 900.00,
                stock: 25,
                minStock: 5,
                maxStock: 100,
                category: 'Tecnología',
                productType: 'PHYSICAL',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Mouse Inalámbrico',
                description: 'Mouse inalámbrico ergonómico',
                sku: 'MOU-INA-002',
                price: 25.00,
                cost: 15.00,
                stock: 150,
                minStock: 20,
                maxStock: 500,
                category: 'Tecnología',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Silla Ergonómica',
                description: 'Silla de oficina ergonómica con soporte lumbar',
                sku: 'SIL-ERG-003',
                price: 350.00,
                cost: 250.00,
                stock: 40,
                minStock: 10,
                maxStock: 200,
                category: 'Mobiliario',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Papel A4',
                description: 'Papel A4 blanco 75g/m² - Paquete 500 hojas',
                sku: 'PAP-A4-004',
                price: 8.50,
                cost: 6.00,
                stock: 200,
                minStock: 50,
                maxStock: 1000,
                category: 'Papelería',
            },
        }),
        prisma.product.create({
            data: {
                name: 'Marcadores Permanentes',
                description: 'Set de 4 marcadores permanentes colores básicos',
                sku: 'MAR-PER-005',
                price: 12.00,
                cost: 8.00,
                stock: 75,
                minStock: 15,
                maxStock: 300,
                category: 'Papelería',
            },
        }),
    ])

    console.log('✅ Productos creados:', products.length)

    // Create sample sales order
    const salesOrder = await prisma.salesOrder.create({
        data: {
            orderNumber: 'SO-2024-001',
            customerId: customers[0].id,
            userId: adminUser.id,
            status: 'CONFIRMED',
            subtotal: 1237.00,
            taxAmount: 222.66,
            totalAmount: 1459.66,
            notes: 'Pedido inicial de cliente nuevo',
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 1,
                        unitPrice: 1200.00,
                        totalPrice: 1200.00,
                    },
                    {
                        productId: products[1].id,
                        quantity: 1,
                        unitPrice: 25.00,
                        totalPrice: 25.00,
                    },
                    {
                        productId: products[4].id,
                        quantity: 1,
                        unitPrice: 12.00,
                        totalPrice: 12.00,
                    },
                ],
            },
        },
    })

    console.log('✅ Orden de venta creada:', salesOrder.orderNumber)

    // Create purchase order
    const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
            orderNumber: 'PO-2024-001',
            supplierId: suppliers[0].id,
            userId: adminUser.id,
            status: 'PENDING',
            subtotal: 4650.00,
            taxAmount: 837.00,
            totalAmount: 5487.00,
            notes: 'Restock de productos tecnológicos',
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 5,
                        unitPrice: 900.00,
                        totalPrice: 4500.00,
                    },
                    {
                        productId: products[1].id,
                        quantity: 10,
                        unitPrice: 15.00,
                        totalPrice: 150.00,
                    },
                ],
            },
        },
    })

    console.log('✅ Orden de compra creada:', purchaseOrder.orderNumber)

    // Create stock movements
    await Promise.all([
        prisma.stockMovement.create({
            data: {
                productId: products[0].id,
                movementType: 'IN',
                quantity: 25,
                reference: 'STOCK-INICIAL',
                reason: 'Stock inicial del sistema',
            },
        }),
        prisma.stockMovement.create({
            data: {
                productId: products[1].id,
                movementType: 'IN',
                quantity: 150,
                reference: 'STOCK-INICIAL',
                reason: 'Stock inicial del sistema',
            },
        }),
        prisma.stockMovement.create({
            data: {
                productId: products[0].id,
                movementType: 'OUT',
                quantity: -1,
                reference: salesOrder.orderNumber,
                reason: 'Venta a cliente',
            },
        }),
    ])

    console.log('✅ Movimientos de stock creados')

    // Create software licenses for existing customers
    const softwareLicenses = await Promise.all([
        prisma.softwareLicense.create({
            data: {
                productId: products[0].id, // ERP Empresarial Pro
                customerId: customers[0].id,
                licenseKey: 'ERP-PRO-' + Math.random().toString(36).substring(2, 15).toUpperCase(),
                licenseType: 'CONCURRENT_USERS',
                maxUsers: 10,
                activationDate: new Date(),
                isActive: true,
                domain: 'empresa1.com',
                notes: 'Licencia para 10 usuarios concurrentes',
            },
        }),
        prisma.softwareLicense.create({
            data: {
                productId: products[1].id, // CRM Avanzado
                customerId: customers[1].id,
                licenseKey: 'CRM-ADV-' + Math.random().toString(36).substring(2, 15).toUpperCase(),
                licenseType: 'NAMED_USERS',
                maxInstallations: 5,
                activationDate: new Date(),
                isActive: true,
                notes: 'Licencia para 5 usuarios nombrados',
            },
        }),
    ])

    console.log('✅ Licencias de software creadas:', softwareLicenses.length)

    // Create software quotes
    const softwareQuotes = await Promise.all([
        prisma.softwareQuote.create({
            data: {
                quoteNumber: 'SQ-2024-001',
                customerId: customers[0].id,
                createdBy: adminUser.id,
                quoteDate: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                status: 'SENT',
                subtotal: 5000.00,
                discountAmount: 500.00,
                taxAmount: 450.00,
                totalAmount: 4950.00,
                notes: 'Cotización para implementación completa ERP + CRM',
                terms: 'Pago 50% adelantado, resto a 30 días',
            },
        }),
    ])

    // Create quote items
    await Promise.all([
        prisma.softwareQuoteItem.create({
            data: {
                quoteId: softwareQuotes[0].id,
                productId: products[0].id, // ERP Empresarial Pro
                quantity: 1,
                unitPrice: 2500.00,
                discount: 250.00,
                totalPrice: 2250.00,
                licenseType: 'CONCURRENT_USERS',
                supportMonths: 12,
                notes: 'Licencia para 10 usuarios concurrentes',
            },
        }),
        prisma.softwareQuoteItem.create({
            data: {
                quoteId: softwareQuotes[0].id,
                productId: products[1].id, // CRM Avanzado
                quantity: 1,
                unitPrice: 1200.00,
                discount: 120.00,
                totalPrice: 1080.00,
                licenseType: 'NAMED_USERS',
                supportMonths: 6,
                notes: 'Licencia para 5 usuarios nombrados',
            },
        }),
    ])

    console.log('✅ Cotizaciones de software creadas:', softwareQuotes.length)

    console.log('🎉 Seed completado exitosamente!')
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e)
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })