/**
 * Mock Data para el Sistema ERP
 * Este archivo contiene datos de prueba para desarrollo y demostración
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalPurchases: number;
  lastPurchase: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardMetrics {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  profit: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface ChartData {
  month: string;
  revenue: number;
  orders: number;
}

// Productos Mock
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop HP ProBook 450',
    description: 'Laptop profesional con procesador Intel i7',
    price: 899.99,
    stock: 15,
    category: 'Electrónica',
    sku: 'LAP-HP-450',
  },
  {
    id: 'prod-2',
    name: 'Monitor Dell 27" 4K',
    description: 'Monitor profesional 4K con panel IPS',
    price: 449.99,
    stock: 8,
    category: 'Electrónica',
    sku: 'MON-DELL-27',
  },
  {
    id: 'prod-3',
    name: 'Teclado Mecánico Logitech',
    description: 'Teclado mecánico RGB para gaming y oficina',
    price: 129.99,
    stock: 25,
    category: 'Accesorios',
    sku: 'KEY-LOG-MEC',
  },
  {
    id: 'prod-4',
    name: 'Mouse Inalámbrico MX Master 3',
    description: 'Mouse ergonómico para productividad',
    price: 99.99,
    stock: 30,
    category: 'Accesorios',
    sku: 'MOU-LOG-MX3',
  },
  {
    id: 'prod-5',
    name: 'Silla Ergonómica Herman Miller',
    description: 'Silla de oficina premium con soporte lumbar',
    price: 1299.99,
    stock: 5,
    category: 'Mobiliario',
    sku: 'CHA-HER-ERG',
  },
  {
    id: 'prod-6',
    name: 'Escritorio Ajustable SmartDesk',
    description: 'Escritorio de altura ajustable eléctrico',
    price: 599.99,
    stock: 12,
    category: 'Mobiliario',
    sku: 'DSK-SMT-ADJ',
  },
];

// Clientes Mock
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Tech Solutions SA',
    email: 'contacto@techsolutions.com',
    phone: '+34 912 345 678',
    company: 'Tech Solutions',
    totalPurchases: 15499.85,
    lastPurchase: '2025-11-10',
  },
  {
    id: 'cust-2',
    name: 'Innovate SL',
    email: 'info@innovate.es',
    phone: '+34 913 456 789',
    company: 'Innovate',
    totalPurchases: 8750.50,
    lastPurchase: '2025-11-08',
  },
  {
    id: 'cust-3',
    name: 'Global Corp',
    email: 'sales@globalcorp.com',
    phone: '+34 914 567 890',
    company: 'Global Corp',
    totalPurchases: 22100.00,
    lastPurchase: '2025-11-12',
  },
  {
    id: 'cust-4',
    name: 'StartupHub',
    email: 'hello@startuphub.io',
    phone: '+34 915 678 901',
    company: 'StartupHub',
    totalPurchases: 5200.75,
    lastPurchase: '2025-11-05',
  },
];

// Facturas Mock
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    customerId: 'cust-1',
    customerName: 'Tech Solutions SA',
    amount: 2699.97,
    status: 'paid',
    date: '2025-11-10',
    dueDate: '2025-11-25',
    items: [
      {
        productId: 'prod-1',
        productName: 'Laptop HP ProBook 450',
        quantity: 3,
        unitPrice: 899.99,
        total: 2699.97,
      },
    ],
  },
  {
    id: 'inv-002',
    customerId: 'cust-2',
    customerName: 'Innovate SL',
    amount: 1349.97,
    status: 'pending',
    date: '2025-11-08',
    dueDate: '2025-11-23',
    items: [
      {
        productId: 'prod-3',
        productName: 'Teclado Mecánico Logitech',
        quantity: 5,
        unitPrice: 129.99,
        total: 649.95,
      },
      {
        productId: 'prod-4',
        productName: 'Mouse Inalámbrico MX Master 3',
        quantity: 7,
        unitPrice: 99.99,
        total: 699.93,
      },
    ],
  },
  {
    id: 'inv-003',
    customerId: 'cust-3',
    customerName: 'Global Corp',
    amount: 6499.95,
    status: 'paid',
    date: '2025-11-12',
    dueDate: '2025-11-27',
    items: [
      {
        productId: 'prod-5',
        productName: 'Silla Ergonómica Herman Miller',
        quantity: 5,
        unitPrice: 1299.99,
        total: 6499.95,
      },
    ],
  },
  {
    id: 'inv-004',
    customerId: 'cust-4',
    customerName: 'StartupHub',
    amount: 899.99,
    status: 'overdue',
    date: '2025-10-25',
    dueDate: '2025-11-09',
    items: [
      {
        productId: 'prod-1',
        productName: 'Laptop HP ProBook 450',
        quantity: 1,
        unitPrice: 899.99,
        total: 899.99,
      },
    ],
  },
  {
    id: 'inv-005',
    customerId: 'cust-1',
    customerName: 'Tech Solutions SA',
    amount: 3599.94,
    status: 'paid',
    date: '2025-11-05',
    dueDate: '2025-11-20',
    items: [
      {
        productId: 'prod-2',
        productName: 'Monitor Dell 27" 4K',
        quantity: 8,
        unitPrice: 449.99,
        total: 3599.92,
      },
    ],
  },
];

// Métricas del Dashboard
export const mockDashboardMetrics: DashboardMetrics = {
  revenue: {
    current: 45789.50,
    previous: 38562.30,
    change: 18.7,
  },
  orders: {
    current: 156,
    previous: 134,
    change: 16.4,
  },
  customers: {
    current: 48,
    previous: 42,
    change: 14.3,
  },
  profit: {
    current: 18945.75,
    previous: 15890.20,
    change: 19.2,
  },
};

// Datos de gráficos
export const mockChartData: ChartData[] = [
  { month: 'Ene', revenue: 28500, orders: 95 },
  { month: 'Feb', revenue: 32100, orders: 108 },
  { month: 'Mar', revenue: 29800, orders: 98 },
  { month: 'Abr', revenue: 35400, orders: 115 },
  { month: 'May', revenue: 38200, orders: 125 },
  { month: 'Jun', revenue: 41500, orders: 138 },
  { month: 'Jul', revenue: 39800, orders: 132 },
  { month: 'Ago', revenue: 37200, orders: 120 },
  { month: 'Sep', revenue: 42100, orders: 142 },
  { month: 'Oct', revenue: 44800, orders: 148 },
  { month: 'Nov', revenue: 45789.50, orders: 156 },
];

// Usuarios Mock para autenticación
export const mockUsers = [
  {
    email: 'admin@erp.com',
    password: 'admin123',
    name: 'Antonio Administrador',
    role: 'Administrador',
  },
  {
    email: 'usuario@erp.com',
    password: 'usuario123',
    name: 'María Usuario',
    role: 'Usuario',
  },
  {
    email: 'demo@erp.com',
    password: 'demo123',
    name: 'Demo Usuario',
    role: 'Demo',
  },
];

// Actividad reciente
export interface Activity {
  id: string;
  type: 'invoice' | 'customer' | 'product' | 'order';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'invoice',
    title: 'Nueva factura creada',
    description: 'Factura #INV-003 para Global Corp',
    timestamp: '2025-11-12T14:30:00Z',
    user: 'Antonio Administrador',
  },
  {
    id: 'act-2',
    type: 'customer',
    title: 'Nuevo cliente registrado',
    description: 'StartupHub agregado al sistema',
    timestamp: '2025-11-11T10:15:00Z',
    user: 'María Usuario',
  },
  {
    id: 'act-3',
    type: 'order',
    title: 'Pedido completado',
    description: 'Pedido #ORD-156 entregado',
    timestamp: '2025-11-10T16:45:00Z',
    user: 'Antonio Administrador',
  },
  {
    id: 'act-4',
    type: 'product',
    title: 'Stock actualizado',
    description: 'Mouse MX Master 3: +15 unidades',
    timestamp: '2025-11-09T09:20:00Z',
    user: 'María Usuario',
  },
  {
    id: 'act-5',
    type: 'invoice',
    title: 'Factura pagada',
    description: 'Factura #INV-001 marcada como pagada',
    timestamp: '2025-11-08T11:00:00Z',
    user: 'Antonio Administrador',
  },
];

