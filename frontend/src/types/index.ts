// User Types
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'READONLY';

// Product Types
export interface Product {
    id: number;
    name: string;
    sku: string;
    description?: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    category?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Customer Types
export interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Supplier Types
export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Sales Order Types
export interface SalesOrder {
    id: number;
    orderNumber: string;
    customerId: number;
    customer?: Customer;
    orderDate: string;
    status: SalesOrderStatus;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    notes?: string;
    deliveryDate?: string;
    deliveredAt?: string;
    items: SalesOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export type SalesOrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export interface SalesOrderItem {
    id: number;
    salesOrderId: number;
    productId: number;
    product?: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Purchase Order Types
export interface PurchaseOrder {
    id: number;
    orderNumber: string;
    supplierId: number;
    supplier?: Supplier;
    orderDate: string;
    status: PurchaseOrderStatus;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    notes?: string;
    expectedDeliveryDate?: string;
    receivedDate?: string;
    items: PurchaseOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export type PurchaseOrderStatus =
    | 'PENDING'
    | 'SENT'
    | 'CONFIRMED'
    | 'RECEIVED'
    | 'CANCELLED';

export interface PurchaseOrderItem {
    id: number;
    purchaseOrderId: number;
    productId: number;
    product?: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Stock Movement Types
export interface StockMovement {
    id: number;
    productId: number;
    product?: Product;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    reference?: string;
    createdAt: string;
}

// Report Types
export interface FinancialSummary {
    totalSales: number;
    totalPurchases: number;
    netProfit: number;
    profitMargin: number;
    salesOrdersCount: number;
    purchaseOrdersCount: number;
}

export interface InventoryValue {
    totalValue: number;
    totalProducts: number;
    lowStockCount: number;
}

export interface SalesByMonth {
    month: string;
    year: number;
    totalSales: number;
    ordersCount: number;
}

export interface TopProduct {
    productId: number;
    productName: string;
    productSku: string;
    totalQuantity: number;
    totalRevenue: number;
}

// Form Input Types
export interface LoginInput {
    email: string;
    password: string;
}

export interface CreateProductInput {
    name: string;
    sku: string;
    description?: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    category?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: number;
}

export interface CreateCustomerInput {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
}

export interface CreateSalesOrderInput {
    customerId: number;
    notes?: string;
    deliveryDate?: string;
    items: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
}

export interface CreatePurchaseOrderInput {
    supplierId: number;
    notes?: string;
    expectedDeliveryDate?: string;
    items: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
}

export interface CreateUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

// API Response Types
export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface PaginationInput {
    skip?: number;
    take?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    take: number;
}
