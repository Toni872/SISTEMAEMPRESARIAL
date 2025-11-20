import { useState, useEffect } from 'react';
import { apiClient } from '../api';

interface DashboardStats {
  // Métricas básicas
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  lowStockCount: number;
  
  // Métricas financieras
  averageTicket: number;
  profitMargin: number;
  totalProfit: number;
  
  // Comparaciones temporales
  revenueChangePercent: number;
  salesChangePercent: number;
  revenuePreviousPeriod: number;
  salesPreviousPeriod: number;
  
  // Top items
  topProducts: any[];
  topCustomers: any[];
  
  // Distribuciones
  categoryDistribution: any[];
  salesByStatus: {
    completed: number;
    pending: number;
    cancelled: number;
  };
  
  // Timeline
  salesTimeline: any[];
  
  // Alertas
  alerts: any[];
  
  // Datos recientes
  recentSales: any[];
  recentProducts: any[];
  
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStockCount: 0,
    averageTicket: 0,
    profitMargin: 0,
    totalProfit: 0,
    revenueChangePercent: 0,
    salesChangePercent: 0,
    revenuePreviousPeriod: 0,
    salesPreviousPeriod: 0,
    topProducts: [],
    topCustomers: [],
    categoryDistribution: [],
    salesByStatus: {
      completed: 0,
      pending: 0,
      cancelled: 0,
    },
    salesTimeline: [],
    alerts: [],
    recentSales: [],
    recentProducts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener datos del dashboard completo y datos recientes en paralelo
        const [dashboardStats, recentSales, recentProducts] = await Promise.all([
          apiClient.getDashboardStats('month'),
          apiClient.getSales(0, 5),
          apiClient.getProducts(0, 5),
        ]);

        setStats({
          totalRevenue: dashboardStats.total_revenue || 0,
          totalSales: dashboardStats.total_sales || 0,
          totalProducts: dashboardStats.total_products || 0,
          lowStockCount: dashboardStats.low_stock_count || 0,
          averageTicket: dashboardStats.average_ticket || 0,
          profitMargin: dashboardStats.profit_margin || 0,
          totalProfit: dashboardStats.total_profit || 0,
          revenueChangePercent: dashboardStats.revenue_change_percent || 0,
          salesChangePercent: dashboardStats.sales_change_percent || 0,
          revenuePreviousPeriod: dashboardStats.revenue_previous_period || 0,
          salesPreviousPeriod: dashboardStats.sales_previous_period || 0,
          topProducts: dashboardStats.top_products || [],
          topCustomers: dashboardStats.top_customers || [],
          categoryDistribution: dashboardStats.category_distribution || [],
          salesByStatus: dashboardStats.sales_by_status || {
            completed: 0,
            pending: 0,
            cancelled: 0,
          },
          salesTimeline: dashboardStats.sales_timeline || [],
          alerts: dashboardStats.alerts || [],
          recentSales: recentSales || [],
          recentProducts: recentProducts || [],
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Error al cargar datos del dashboard',
        }));
      }
    };

    fetchDashboardData();
  }, []);

  return stats;
}


